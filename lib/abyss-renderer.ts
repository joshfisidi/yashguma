import {
  curlFragment,
  heightFragment,
  materialFragment,
  simulationVertex,
  splatFragment,
  surfaceFragment,
  surfaceVertex,
  velocityFragment,
} from "./abyss-shaders";

type Target = { texture: WebGLTexture; framebuffer: WebGLFramebuffer };
type Uniform = number | readonly number[] | WebGLTexture;
type Splat = { point: readonly number[]; force: readonly number[]; radial?: number };

const simulationHeight = 128;
const step = 1 / 120;
const radius = 0.045;

export function createAbyssRenderer(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("webgl2", { alpha: false, antialias: false, depth: false });
  if (!context) return;
  const gl = context;

  const programs: WebGLProgram[] = [];
  const textures = new Set<WebGLTexture>();
  const framebuffers = new Set<WebGLFramebuffer>();
  const quad = gl.createBuffer();

  function destroy() {
    for (const framebuffer of framebuffers) gl.deleteFramebuffer(framebuffer);
    for (const texture of textures) gl.deleteTexture(texture);
    for (const program of programs) gl.deleteProgram(program);
    gl.deleteBuffer(quad);
  }

  function compile(type: number, source: string) {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("Could not allocate Abyss shader");

    const fragment = type === gl.FRAGMENT_SHADER;
    const body = source
      .replaceAll("attribute vec2 position;", "layout(location = 0) in vec2 position;")
      .replaceAll("attribute vec2 uv;", "layout(location = 1) in vec2 uv;")
      .replaceAll("varying ", fragment ? "in " : "out ")
      .replaceAll("texture2D(", "texture(")
      .replaceAll("gl_FragColor", "fragColor");

    gl.shaderSource(shader, "#version 300 es\n" + (fragment ? "out highp vec4 fragColor;\n" : "") + body);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(message ?? "Could not compile Abyss shader");
    }
    return shader;
  }

  function createPass(vertex: string, fragment: string) {
    const program = gl.createProgram();
    if (!program) throw new Error("Could not allocate Abyss program");
    programs.push(program);

    const vertexShader = compile(gl.VERTEX_SHADER, vertex);
    try {
      const fragmentShader = compile(gl.FRAGMENT_SHADER, fragment);
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.deleteShader(fragmentShader);
      gl.linkProgram(program);
    } finally {
      gl.deleteShader(vertexShader);
    }
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) ?? "Could not link Abyss program");
    }

    const locations = new Map<string, WebGLUniformLocation | null>();
    return (target: Target | null, uniforms: Record<string, Uniform>) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, target?.framebuffer ?? null);
      gl.viewport(0, 0, target ? simulationWidth : canvas.width, target ? simulationHeight : canvas.height);
      gl.useProgram(program);

      let unit = 0;
      for (const [name, value] of Object.entries(uniforms)) {
        if (!locations.has(name)) locations.set(name, gl.getUniformLocation(program, name));
        const location = locations.get(name) ?? null;
        if (typeof value === "number") gl.uniform1f(location, value);
        else if (value instanceof WebGLTexture) {
          gl.activeTexture(gl.TEXTURE0 + unit);
          gl.bindTexture(gl.TEXTURE_2D, value);
          gl.uniform1i(location, unit++);
        } else if (value.length === 2) gl.uniform2fv(location, value);
        else gl.uniform3fv(location, value);
      }

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
  }

  let simulationWidth = 0;
  let texel = [0, 0];
  let aspect = 1;

  function createTexture(width: number, height: number, halfFloat: boolean) {
    const texture = gl.createTexture();
    if (!texture) throw new Error("Could not allocate Abyss texture");
    textures.add(texture);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, halfFloat ? gl.RGBA16F : gl.RGBA8, width, height, 0,
      gl.RGBA, halfFloat ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE, halfFloat ? null : new Uint8Array(4),
    );
    return texture;
  }

  function createTarget(): Target {
    const texture = createTexture(simulationWidth, simulationHeight, true);
    const framebuffer = gl.createFramebuffer();
    if (!framebuffer) throw new Error("Could not allocate Abyss framebuffer");
    framebuffers.add(framebuffer);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      throw new Error("Half-float Abyss framebuffer is unavailable");
    }
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { texture, framebuffer };
  }

  function clearTargets() {
    for (const framebuffer of framebuffers) gl.deleteFramebuffer(framebuffer);
    framebuffers.clear();
    for (const texture of textures) {
      if (texture === empty) continue;
      gl.deleteTexture(texture);
      textures.delete(texture);
    }
  }

  let empty: WebGLTexture;
  try {
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 0, 0,
       3, -1, 2, 0,
      -1,  3, 0, 2,
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);

    empty = createTexture(1, 1, false);
    const drawSurface = createPass(surfaceVertex, surfaceFragment);
    const canSimulate = gl.getExtension("EXT_color_buffer_float") || gl.getExtension("EXT_color_buffer_half_float");
    const passes = canSimulate && {
      splat: createPass(simulationVertex, splatFragment),
      curl: createPass(simulationVertex, curlFragment),
      velocity: createPass(simulationVertex, velocityFragment),
      height: createPass(simulationVertex, heightFragment),
      material: createPass(simulationVertex, materialFragment),
    };

    let targets: { velocity: [Target, Target]; material: [Target, Target]; curl: Target } | undefined;
    let elapsed = 0;
    let pending: Splat[] = [];
    let heldPoint: readonly number[] | undefined;
    let lastPointer: { x: number; y: number; time: number } | undefined;

    function resize() {
      const width = Math.max(1, canvas.clientWidth);
      const height = Math.max(1, canvas.clientHeight);
      const scale = Math.min(1, Math.sqrt(1_250_000 / (width * height)));
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));

      const nextWidth = Math.min(gl.getParameter(gl.MAX_TEXTURE_SIZE), Math.max(16, Math.round(simulationHeight * width / height)));
      if (!passes || nextWidth === simulationWidth) return;
      clearTargets();
      simulationWidth = nextWidth;
      aspect = simulationWidth / simulationHeight;
      texel = [1 / simulationWidth, 1 / simulationHeight];
      try {
        targets = { velocity: [createTarget(), createTarget()], material: [createTarget(), createTarget()], curl: createTarget() };
      } catch {
        targets = undefined;
        clearTargets();
      }
    }

    function render(time: number, delta: number) {
      if (targets && passes) {
        const { velocity, material, curl } = targets;
        const grid = { uTexel: texel, uAspect: aspect };
        const addSplat = ({ point, force, radial = 0 }: Splat) => {
          passes.splat(velocity[1], {
            ...grid, uV: velocity[0].texture, uPoint: point, uForce: force, uRadial: radial, uRadius: radius,
          });
          velocity.reverse();
        };

        pending.forEach(addSplat);
        pending = [];
        elapsed = Math.min(elapsed + delta, step * 4);
        while (elapsed >= step) {
          if (heldPoint) addSplat({ point: heldPoint, force: [0, 0, -0.12 * step] });
          passes.curl(curl, { ...grid, uV: velocity[0].texture });
          passes.velocity(velocity[1], {
            ...grid, uV: velocity[0].texture, uC: curl.texture, uD: material[0].texture,
            uDt: step, uG: 4.9, uK: 18, uDamp: 0.85, uVort: 0.15, uNu: 0.06,
          });
          velocity.reverse();
          passes.height(velocity[1], { ...grid, uV: velocity[0].texture, uDt: step, uH0: 0.025, uHDamp: 0.35, uNu: 0.06 });
          velocity.reverse();
          passes.material(material[1], {
            ...grid, uD: material[0].texture, uV: velocity[0].texture,
            uDt: step, uDecay: 0.04, uKappa: 0.4, uS0: 4, uLDecay: 1.1,
          });
          material.reverse();
          elapsed -= step;
        }
      }

      drawSurface(null, {
        uTime: time, uRes: [canvas.width, canvas.height], uAngle: 0.38,
        uSimV: targets?.velocity[0].texture ?? empty, uSimD: targets?.material[0].texture ?? empty,
        uSimTexel: targets ? texel : [1, 1],
      });
    }

    function pointer(x: number, y: number, time: number, pressed: boolean) {
      if (!targets) return;
      if (pressed && !heldPoint) pending.push({ point: [x, y], force: [0, 0, -0.08], radial: 2 });
      heldPoint = pressed ? [x, y] : undefined;

      if (lastPointer && time > lastPointer.time) {
        const dx = x - lastPointer.x;
        const dy = y - lastPointer.y;
        const distance = Math.hypot(dx * aspect, dy);
        const duration = Math.max(time - lastPointer.time, 1 / 240);
        const count = Math.min(8, Math.max(1, Math.ceil(distance / (radius * 0.6))));
        const strength = (pressed ? 0.45 : 0.18) / (count * Math.max(duration, distance / 3));
        for (let index = 1; index <= count; index++) {
          const fraction = index / count;
          pending.push({
            point: [lastPointer.x + dx * fraction, lastPointer.y + dy * fraction],
            force: [dx * aspect * strength, dy * strength, 0],
          });
        }
      }
      lastPointer = { x, y, time };
      if (pending.length > 48) pending.splice(0, pending.length - 48);
    }

    function release() {
      lastPointer = undefined;
      heldPoint = undefined;
    }

    return { resize, render, pointer, release, destroy };
  } catch (error) {
    destroy();
    console.warn("Abyss background could not start", error);
  }
}
