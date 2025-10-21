"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { wig20Companies } from "@/constants/constants";
import SelectableList from "./SelectableList";


interface SidebarProps {
  selectedCompany: string | null;
  onSelectCompany: (company: string) => void;
}

export default function Sidebar({ selectedCompany, onSelectCompany }: SidebarProps) {
  return (
    <div className="w-[20%] border-r border-gray-200 p-0 h-full">
      <Accordion type="single" collapsible className="w-full h-full">
        <AccordionItem value="wig20">
          <AccordionTrigger className="bg-gray-100 hover:bg-gray-200 rounded-md px-4 py-2 text-sm font-medium">
            <span className="w-full text-center">WIG 20</span>
          </AccordionTrigger>
          <AccordionContent>
            <SelectableList
              items={wig20Companies}
              selectedItem={selectedCompany}
              onSelectItem={onSelectCompany}
              format={(e) => e}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
