import { RefObject } from "react";

interface UseApexZoomEventsParams {
  isResettingZoom: RefObject<boolean>;
  setVisibleRange: (range: { min: string; max: string } | null) => void;
}

export function useApexZoomEvents({
  isResettingZoom,
  setVisibleRange,
}: UseApexZoomEventsParams) {
  return {
    zoomed: (chartContext: any, { xaxis }: any) => {
      if (isResettingZoom.current) {
        isResettingZoom.current = false;
        return;
      }

      const categories = chartContext.w.globals.categoryLabels;
      const seriesLength = chartContext.w.config.series[0]?.data?.length || 0;

      const minIndex = xaxis?.min != null ? Math.floor(xaxis.min) : 0;
      const maxIndex =
        xaxis?.max != null ? Math.ceil(xaxis.max) : seriesLength - 1;

      const minCategory = categories[minIndex == 1 ? 0 : minIndex];
      const maxCategory = categories[maxIndex];

      setVisibleRange({ min: minCategory, max: maxCategory });
    },
    beforeResetZoom: (chartContext: any, { xaxis }: any) => {
      isResettingZoom.current = true;
      setVisibleRange(null);
    },
  };
}
