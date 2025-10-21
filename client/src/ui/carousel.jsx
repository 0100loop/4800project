import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "./utils";
import { Button } from "./button";

const CarouselCtx = React.createContext(null);
function useCarousel(){ const c = React.useContext(CarouselCtx); if(!c) throw new Error("useCarousel must be used within <Carousel/>"); return c; }

export function Carousel({ orientation="horizontal", opts, setApi, plugins, className, children, ...props }){
  const [viewportRef, api] = useEmblaCarousel({ ...(opts||{}), axis: orientation==="horizontal"?"x":"y" }, plugins);
  const [canPrev,setCanPrev]=React.useState(false);
  const [canNext,setCanNext]=React.useState(false);

  const onSelect = React.useCallback(a=>{ if(!a) return; setCanPrev(a.canScrollPrev()); setCanNext(a.canScrollNext()); },[]);
  const scrollPrev = React.useCallback(()=>api?.scrollPrev(),[api]);
  const scrollNext = React.useCallback(()=>api?.scrollNext(),[api]);

  React.useEffect(()=>{ if(!api) return; setApi?.(api); onSelect(api); api.on("reInit", onSelect); api.on("select", onSelect); return ()=>api?.off("select", onSelect); },[api,onSelect,setApi]);

  return (
    <CarouselCtx.Provider value={{ viewportRef, api, orientation, scrollPrev, scrollNext, canPrev, canNext }}>
      <div className={cn("relative", className)} role="region" aria-roledescription="carousel" {...props}>{children}</div>
    </CarouselCtx.Provider>
  );
}

export function CarouselContent({ className, ...props }){
  const { viewportRef, orientation } = useCarousel();
  return (
    <div ref={viewportRef} className="overflow-hidden" data-slot="carousel-content">
      <div className={cn("flex", orientation==="horizontal" ? "-ml-4" : "-mt-4 flex-col", className)} {...props}/>
    </div>
  );
}

export function CarouselItem({ className, ...props }){
  const { orientation } = useCarousel();
  return <div role="group" aria-roledescription="slide" className={cn("min-w-0 shrink-0 grow-0 basis-full", orientation==="horizontal"?"pl-4":"pt-4", className)} {...props}/>;
}

export function CarouselPrevious({ className, ...props }){
  const { orientation, scrollPrev, canPrev } = useCarousel();
  return (
    <Button variant="outline" size="icon"
      className={cn("absolute size-8 rounded-full", orientation==="horizontal"?"top-1/2 -left-12 -translate-y-1/2":"-top-12 left-1/2 -translate-x-1/2 rotate-90", className)}
      disabled={!canPrev} onClick={scrollPrev} {...props}>
      <ArrowLeft/><span className="sr-only">Previous</span>
    </Button>
  );
}

export function CarouselNext({ className, ...props }){
  const { orientation, scrollNext, canNext } = useCarousel();
  return (
    <Button variant="outline" size="icon"
      className={cn("absolute size-8 rounded-full", orientation==="horizontal"?"top-1/2 -right-12 -translate-y-1/2":"-bottom-12 left-1/2 -translate-x-1/2 rotate-90", className)}
      disabled={!canNext} onClick={scrollNext} {...props}>
      <ArrowRight/><span className="sr-only">Next</span>
    </Button>
  );
}
