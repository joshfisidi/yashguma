import { type FC } from 'react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Bold, Italic, Underline } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

const Home: FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Open Sheet</Button>
        </SheetTrigger>
        <SheetContent side="top">
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>
              This is a description of what this sheet does.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <p>Your sheet content goes here</p>
          </div>
        </SheetContent>
      </Sheet>

      <Carousel className="w-full max-w-xs">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <div className="flex aspect-square items-center justify-center rounded-md border border-slate-200 bg-white">
                  <span className="text-3xl font-semibold">{index + 1}</span>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <ToggleGroup type="multiple" className="flex justify-center mb-4">
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <Bold className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <Italic className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline">
          <Underline className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="max-w-2xl mx-auto px-4">
        <Textarea 
          placeholder="Type your comment here..." 
          className="min-h-[120px]"
        />
      </div>
    </div>
  );
}

export default Home;
