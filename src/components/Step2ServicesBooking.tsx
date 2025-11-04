import React, { useState, useRef, useEffect } from "react";
import {
  CalendarCheck,
  Star,
  Plus,
  Edit2,
  X,
  Clock,
  Check,
  Minus,
  Copy,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import svgPaths from "../imports/svg-nbymm9fh8j";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
}

interface Service {
  id: number;
  name: string;
  price: number;
}

type DayCode = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

interface WorkingRule {
  id: string;
  days: DayCode[];
  startHour: number; // 0-24 in 0.25 increments (15-minute precision)
  endHour: number;   // 0-24 in 0.25 increments
  slotsEnabled: boolean;
  mode: "duration" | "quantity";
  slotDurationH: number;
  slotQuantity: number;
  collapsed: boolean;
}

const DAYS: { code: DayCode; label: string }[] = [
  { code: "mon", label: "Mon" },
  { code: "tue", label: "Tue" },
  { code: "wed", label: "Wed" },
  { code: "thu", label: "Thu" },
  { code: "fri", label: "Fri" },
  { code: "sat", label: "Sat" },
  { code: "sun", label: "Sun" },
];

const DURATION_STEPS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4, 4.25, 4.5, 4.75, 5, 5.25, 5.5, 5.75, 6, 6.25, 6.5, 6.75, 7, 7.25, 7.5, 7.75, 8]; // hours - 15min steps

export function Step2ServicesBooking({ onNext, onBack }: Step2Props) {
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: "Classic Haircut", price: 50 },
    { id: 2, name: "Beard Trim & Shape", price: 30 },
    { id: 3, name: "Deluxe Grooming", price: 80 },
  ]);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const [workingRules, setWorkingRules] = useState<WorkingRule[]>([
    {
      id: "rule-1",
      days: ["mon", "tue", "wed", "thu", "fri"],
      startHour: 8,
      endHour: 18,
      slotsEnabled: false,
      mode: "duration",
      slotDurationH: 2,
      slotQuantity: 5,
      collapsed: false,
    },
  ]);

  const [sameDayBooking, setSameDayBooking] = useState(true);
  const [maxAdvanceBooking, setMaxAdvanceBooking] = useState("1 month");
  const [cancellationPolicy, setCancellationPolicy] = useState("No notice required");
  const [maxAdvanceOpen, setMaxAdvanceOpen] = useState(false);
  const [cancellationOpen, setCancellationOpen] = useState(false);
  
  const maxAdvanceRef = useRef<HTMLDivElement>(null);
  const cancellationRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (maxAdvanceRef.current && !maxAdvanceRef.current.contains(event.target as Node)) {
        setMaxAdvanceOpen(false);
      }
      if (cancellationRef.current && !cancellationRef.current.contains(event.target as Node)) {
        setCancellationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper functions
  const formatTimeDisplay = (hour: number): string => {
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    const period = h >= 12 ? "PM" : "AM";
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    if (m === 0) {
      return `${displayHour}:00 ${period}`;
    }
    return `${displayHour}:${m.toString().padStart(2, "0")} ${period}`;
  };

  const formatDurationDisplay = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (m === 0) return `${h}h`;
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
  };

  const roundToQuarterHour = (value: number): number => {
    return Math.round(value * 4) / 4;
  };

  const getUsedDays = (): DayCode[] => {
    const used = new Set<DayCode>();
    workingRules.forEach((rule) => rule.days.forEach((day) => used.add(day)));
    return Array.from(used);
  };

  const getAvailableDays = (): DayCode[] => {
    const used = getUsedDays();
    return DAYS.map((d) => d.code).filter((day) => !used.includes(day));
  };

  const canAddRule = (): boolean => {
    return getAvailableDays().length > 0;
  };

  const addService = () => {
    if (newServiceName && newServicePrice) {
      setServices([
        ...services,
        {
          id: Date.now(),
          name: newServiceName,
          price: parseFloat(newServicePrice),
        },
      ]);
      setNewServiceName("");
      setNewServicePrice("");
    }
  };

  const deleteService = (id: number) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const startEdit = (service: Service) => {
    setEditingId(service.id);
    setEditName(service.name);
    setEditPrice(service.price.toString());
  };

  const saveEdit = () => {
    if (editingId && editName && editPrice) {
      setServices(
        services.map((s) =>
          s.id === editingId
            ? { ...s, name: editName, price: parseFloat(editPrice) }
            : s
        )
      );
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditPrice("");
  };

  const addRule = () => {
    const availableDays = getAvailableDays();
    if (availableDays.length === 0) return;

    setWorkingRules([
      ...workingRules,
      {
        id: `rule-${Date.now()}`,
        days: [availableDays[0]],
        startHour: 9,
        endHour: 17,
        slotsEnabled: false,
        mode: "duration",
        slotDurationH: 2,
        slotQuantity: 4,
        collapsed: false,
      },
    ]);
  };

  const updateRule = (ruleId: string, updates: Partial<WorkingRule>) => {
    setWorkingRules(
      workingRules.map((rule) => {
        if (rule.id !== ruleId) return rule;

        const updated = { ...rule, ...updates };

        // Recalculate based on mode and what changed
        if (updates.startHour !== undefined || updates.endHour !== undefined || updates.mode !== undefined || updates.slotDurationH !== undefined || updates.slotQuantity !== undefined) {
          const totalHours = updated.endHour - updated.startHour;

          if (updated.mode === "duration") {
            // When in duration mode: recalculate quantity based on duration and time range
            if (updated.slotDurationH > 0) {
              updated.slotQuantity = Math.max(1, Math.floor(totalHours / updated.slotDurationH));
            }
          } else if (updated.mode === "quantity") {
            // When in quantity mode: recalculate duration based on quantity and time range
            if (updated.slotQuantity > 0) {
              updated.slotDurationH = roundToQuarterHour(totalHours / updated.slotQuantity);
              // Clamp to allowed range
              updated.slotDurationH = Math.max(0.25, Math.min(8, updated.slotDurationH));
            }
          }
        }

        return updated;
      })
    );
  };

  const removeRule = (ruleId: string) => {
    setWorkingRules(workingRules.filter((rule) => rule.id !== ruleId));
  };

  const toggleDayInRule = (ruleId: string, day: DayCode) => {
    setWorkingRules(
      workingRules.map((rule) => {
        if (rule.id !== ruleId) return rule;

        const hasDayInOtherRules = workingRules.some(
          (r) => r.id !== ruleId && r.days.includes(day)
        );

        if (hasDayInOtherRules) return rule;

        const newDays = rule.days.includes(day)
          ? rule.days.filter((d) => d !== day)
          : [...rule.days, day];

        // Don't allow empty days array
        if (newDays.length === 0) return rule;

        return { ...rule, days: newDays };
      })
    );
  };

  const changeStartTime = (ruleId: string, increment: boolean) => {
    const rule = workingRules.find((r) => r.id === ruleId);
    if (!rule) return;

    let newStart = increment
      ? Math.min(rule.endHour - 0.25, rule.startHour + 0.25)
      : Math.max(0, rule.startHour - 0.25);

    updateRule(ruleId, { startHour: newStart });
  };

  const changeEndTime = (ruleId: string, increment: boolean) => {
    const rule = workingRules.find((r) => r.id === ruleId);
    if (!rule) return;

    let newEnd = increment
      ? Math.min(24, rule.endHour + 0.25)
      : Math.max(rule.startHour + 0.25, rule.endHour - 0.25);

    updateRule(ruleId, { endHour: newEnd });
  };

  const changeDuration = (ruleId: string, increment: boolean) => {
    const rule = workingRules.find((r) => r.id === ruleId);
    if (!rule) return;

    const currentIndex = DURATION_STEPS.indexOf(rule.slotDurationH);
    let newIndex = increment
      ? Math.min(DURATION_STEPS.length - 1, currentIndex + 1)
      : Math.max(0, currentIndex - 1);

    // If current value not in steps, find nearest
    if (currentIndex === -1) {
      newIndex = DURATION_STEPS.findIndex((d) => d >= rule.slotDurationH);
      if (newIndex === -1) newIndex = DURATION_STEPS.length - 1;
    }

    updateRule(ruleId, { slotDurationH: DURATION_STEPS[newIndex] });
  };

  const changeQuantity = (ruleId: string, increment: boolean) => {
    const rule = workingRules.find((r) => r.id === ruleId);
    if (!rule) return;

    const newQuantity = increment
      ? rule.slotQuantity + 1
      : Math.max(1, rule.slotQuantity - 1);

    updateRule(ruleId, { slotQuantity: newQuantity });
  };

  const handleRangeSliderChange = (ruleId: string, values: number[]) => {
    updateRule(ruleId, {
      startHour: roundToQuarterHour(values[0]),
      endHour: roundToQuarterHour(values[1]),
    });
  };

  const copyRuleSettings = (sourceRuleId: string) => {
    const sourceRule = workingRules.find((r) => r.id === sourceRuleId);
    if (!sourceRule) return;

    const availableDays = getAvailableDays();
    if (availableDays.length === 0) {
      alert("All days are already assigned to rules.");
      return;
    }

    // Create a new rule with the same settings but different days
    setWorkingRules([
      ...workingRules,
      {
        id: `rule-${Date.now()}`,
        days: [availableDays[0]],
        startHour: sourceRule.startHour,
        endHour: sourceRule.endHour,
        slotsEnabled: sourceRule.slotsEnabled,
        mode: sourceRule.mode,
        slotDurationH: sourceRule.slotDurationH,
        slotQuantity: sourceRule.slotQuantity,
        collapsed: false,
      },
    ]);
  };

  // Working Hours Timeline Component
  const WorkingHoursCard = React.forwardRef<HTMLDivElement, { rule: WorkingRule }>(
    ({ rule }, ref) => {
      const totalHours = rule.endHour - rule.startHour;

      // Calculate slot positions for visualization
      const getSlotPositions = (): Array<{ position: number; number: number }> => {
        if (!rule.slotsEnabled || rule.slotQuantity === 0) return [];
        const positions: Array<{ position: number; number: number }> = [];
        
        // Add numbered markers for each slot division
        for (let i = 1; i < rule.slotQuantity; i++) {
          const slotHour = rule.startHour + (i * rule.slotDurationH);
          if (slotHour < rule.endHour) {
            positions.push({
              position: slotHour,
              number: i + 1,
            });
          }
        }
        
        return positions;
      };

      const slotPositions = getSlotPositions();

      return (
        <div
          ref={ref}
          className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:bg-gray-50 transition-colors"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#E5E7EB] bg-[#FAFAFA]">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Day Selector */}
              <div className="flex gap-2">
                {DAYS.map((day) => {
                  const isDayUsedInOtherRule = workingRules.some(
                    (r) => r.id !== rule.id && r.days.includes(day.code)
                  );
                  const isChecked = rule.days.includes(day.code);

                  return isDayUsedInOtherRule && !isChecked ? (
                    <TooltipProvider key={day.code}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <button
                              disabled
                              className="px-3 py-1.5 text-xs rounded-lg bg-white text-[#9CA3AF] border border-[#E5E7EB] cursor-not-allowed"
                            >
                              {day.label}
                            </button>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Used in another schedule</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <button
                      key={day.code}
                      onClick={() => toggleDayInRule(rule.id, day.code)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                        isChecked
                          ? "bg-[#0066FF] text-white border-[#0066FF] shadow-sm"
                          : "bg-white text-[#374151] border-[#E5E7EB] hover:bg-[#F3F4F6] hover:shadow-md"
                      }`}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Delete Rule */}
              {workingRules.length > 1 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeRule(rule.id)}
                        className="h-7 w-7 text-[#EF4444] hover:bg-[#FEE2E2] transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete schedule</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>

          {/* Card Content */}
          <div className="px-4 py-3 space-y-3">
            {/* Working Hours - Single Row */}
            <div className="flex items-center gap-2.5">
              <span className="text-[14px] text-[#111827] shrink-0">Working Hours:</span>
              <span className="text-[14px] text-[#111827]">
                {formatDurationDisplay(totalHours)}
              </span>
              
              {/* Start Time */}
              <div className="flex items-center gap-0.5 bg-white rounded-lg border border-[#D1D5DB] p-0.5 ml-auto">
                <button
                  onClick={() => changeStartTime(rule.id, false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-[#F3F4F6] rounded-md transition-colors"
                >
                  <Minus className="w-3 h-3 text-[#111827]" />
                </button>
                <div className="px-2 text-[14px] min-w-[68px] text-center text-[#111827]">
                  {formatTimeDisplay(rule.startHour)}
                </div>
                <button
                  onClick={() => changeStartTime(rule.id, true)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-[#F3F4F6] rounded-md transition-colors"
                >
                  <Plus className="w-3 h-3 text-[#111827]" />
                </button>
              </div>

              <span className="text-[14px] text-[#9CA3AF]">—</span>

              {/* End Time */}
              <div className="flex items-center gap-0.5 bg-white rounded-lg border border-[#D1D5DB] p-0.5">
                <button
                  onClick={() => changeEndTime(rule.id, false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-[#F3F4F6] rounded-md transition-colors"
                >
                  <Minus className="w-3 h-3 text-[#111827]" />
                </button>
                <div className="px-2 text-[14px] min-w-[68px] text-center text-[#111827]">
                  {formatTimeDisplay(rule.endHour)}
                </div>
                <button
                  onClick={() => changeEndTime(rule.id, true)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-[#F3F4F6] rounded-md transition-colors"
                >
                  <Plus className="w-3 h-3 text-[#111827]" />
                </button>
              </div>
            </div>

            {/* Time Scale Visualization */}
            <div className="bg-[#FAFAFA] rounded-xl p-3.5 border border-[#E5E7EB]">
              <div className="relative h-[70px]">
                {/* Slot numbers above the scale - with smart alternation */}
                {rule.slotsEnabled && (
                  <div className="absolute top-0 left-0 right-0 h-5">
                    {/* Determine if we need to alternate (too many slots) */}
                    {(() => {
                      const shouldAlternate = rule.slotQuantity > 8;
                      
                      return (
                        <>
                          {/* First slot number */}
                          <div
                            className="absolute text-[13px] text-[#374151]"
                            style={{
                              left: `${((rule.startHour + rule.slotDurationH / 2) / 24) * 100}%`,
                              transform: 'translateX(-50%)',
                            }}
                          >
                            1
                          </div>
                          {/* Other slot numbers */}
                          {slotPositions.map((slot, idx) => {
                            // If alternating, only show odd numbers (1, 3, 5, 7...)
                            if (shouldAlternate && slot.number % 2 === 0) {
                              return null;
                            }
                            
                            return (
                              <div
                                key={idx}
                                className="absolute text-[13px] text-[#374151]"
                                style={{
                                  left: `${((slot.position + rule.slotDurationH / 2) / 24) * 100}%`,
                                  transform: 'translateX(-50%)',
                                }}
                              >
                                {slot.number}
                              </div>
                            );
                          })}
                        </>
                      );
                    })()}
                  </div>
                )}
                
                {/* Enhanced tick marks along the timeline - aligned to bottom */}
                <div className="absolute bottom-[26px] left-0 right-0 h-[12px]">
                  {/* Major ticks - every hour - aligned to bottom */}
                  {Array.from({ length: 25 }, (_, i) => i).map((hour) => {
                    const isInRange = hour >= rule.startHour && hour <= rule.endHour;
                    return (
                      <>
                        {hour < 24 && (
                          <div
                            key={`major-${hour}`}
                            className={`absolute w-px ${isInRange ? 'bg-[#0066FF]' : 'bg-[#9CA3AF]'}`}
                            style={{
                              left: `${(hour / 24) * 100}%`,
                              bottom: '0',
                              height: '10px',
                            }}
                          />
                        )}
                      </>
                    );
                  })}
                  
                  {/* Minor ticks - every 30 minutes - aligned to bottom */}
                  {Array.from({ length: 48 }, (_, i) => i * 0.5).map((hour) => {
                    if (hour % 1 === 0) return null; // Skip full hours (already have major ticks)
                    const isInRange = hour >= rule.startHour && hour <= rule.endHour;
                    return (
                      <div
                        key={`minor-${hour}`}
                        className={`absolute w-px ${isInRange ? 'bg-[#0066FF]' : 'bg-[#D1D5DB]'}`}
                        style={{
                          left: `${(hour / 24) * 100}%`,
                          bottom: '0',
                          height: '6px',
                          opacity: isInRange ? 0.8 : 0.6,
                        }}
                      />
                    );
                  })}
                  
                  {/* Ultra-fine ticks - every 15 minutes - aligned to bottom */}
                  {rule.slotDurationH < 0.5 && Array.from({ length: 96 }, (_, i) => i * 0.25).map((hour) => {
                    if (hour % 0.5 === 0) return null; // Skip 30-min marks
                    const isInRange = hour >= rule.startHour && hour <= rule.endHour;
                    return (
                      <div
                        key={`ultrafine-${hour}`}
                        className={`absolute w-px ${isInRange ? 'bg-[#0066FF]' : 'bg-[#E5E7EB]'}`}
                        style={{
                          left: `${(hour / 24) * 100}%`,
                          bottom: '0',
                          height: '4px',
                          opacity: isInRange ? 0.6 : 0.4,
                        }}
                      />
                    );
                  })}
                </div>
                
                {/* Background track (full 24 hours) */}
                <div className="absolute bottom-[26px] w-full h-[12px] bg-[#E5E7EB]" />
                
                {/* Individual slot rectangles with gaps */}
                {rule.slotsEnabled ? (
                  <>
                    {Array.from({ length: rule.slotQuantity }).map((_, idx) => {
                      const slotStart = rule.startHour + (idx * rule.slotDurationH);
                      const slotEnd = slotStart + rule.slotDurationH;
                      const gapPercent = 0.3; // Gap size as percentage of slot width
                      
                      return (
                        <div
                          key={idx}
                          className="absolute bottom-[26px] h-[12px] bg-[#0066FF] rounded-md"
                          style={{
                            left: `calc(${(slotStart / 24) * 100}% + ${gapPercent / 2}%)`,
                            width: `calc(${(rule.slotDurationH / 24) * 100}% - ${gapPercent}%)`,
                          }}
                        />
                      );
                    })}
                    
                    {/* Remainder time - gray rounded rectangle */}
                    {(() => {
                      const totalSlotTime = rule.slotQuantity * rule.slotDurationH;
                      const totalHours = rule.endHour - rule.startHour;
                      const remainder = totalHours - totalSlotTime;
                      
                      if (remainder > 0.01) {
                        const remainderStart = rule.startHour + totalSlotTime;
                        return (
                          <div
                            className="absolute bottom-[26px] h-[12px] bg-[#9CA3AF] rounded-md opacity-50"
                            style={{
                              left: `${(remainderStart / 24) * 100}%`,
                              width: `${(remainder / 24) * 100}%`,
                            }}
                          />
                        );
                      }
                      return null;
                    })()}
                  </>
                ) : (
                  /* Single continuous bar when slots disabled */
                  <div
                    className="absolute bottom-[26px] h-[12px] bg-[#0066FF] rounded-lg"
                    style={{
                      left: `${(rule.startHour / 24) * 100}%`,
                      width: `${((rule.endHour - rule.startHour) / 24) * 100}%`,
                    }}
                  />
                )}
                
                {/* Vertical division lines extending below the timeline - always visible across full 24h */}
                <div className="absolute bottom-0 left-0 right-0 h-[26px]">
                  {/* All time positions - every 15 minutes and every hour */}
                  {Array.from({ length: 97 }, (_, i) => i * 0.25).map((time) => {
                    // Long lines for labeled hours: 0, 3, 6, 9, 12, 15, 18, 21, 24
                    const labeledHours = [0, 3, 6, 9, 12, 15, 18, 21, 24];
                    const isLabeledHour = labeledHours.includes(time);
                    const isFullHour = time % 1 === 0; // Any full hour
                    const isInRange = time >= rule.startHour && time <= rule.endHour;
                    
                    let height, viewBox, pathD, strokeWidth;
                    
                    if (isLabeledHour) {
                      // Longest for labeled hours
                      height = '26px';
                      viewBox = '0 0 1 26';
                      pathD = 'M0.5 0L0.5 26';
                      strokeWidth = '1';
                    } else if (isFullHour) {
                      // Medium for all hours
                      height = '20px';
                      viewBox = '0 0 1 20';
                      pathD = 'M0.5 0L0.5 20';
                      strokeWidth = '0.75';
                    } else {
                      // Short for 15-minute intervals
                      height = '14px';
                      viewBox = '0 0 1 14';
                      pathD = 'M0.5 0L0.5 14';
                      strokeWidth = '0.5';
                    }
                    
                    return (
                      <svg
                        key={`tick-${time}`}
                        className="absolute"
                        style={{
                          left: `${(time / 24) * 100}%`,
                          width: '1px',
                          height: height,
                          bottom: '0',
                        }}
                        viewBox={viewBox}
                        fill="none"
                        preserveAspectRatio="none"
                      >
                        <path
                          d={pathD}
                          stroke={isInRange ? '#0066FF' : '#9CA3AF'}
                          strokeWidth={strokeWidth}
                        />
                      </svg>
                    );
                  })}
                </div>
              </div>

              {/* Enhanced time labels - positioned higher */}
              <div className="relative flex justify-between text-[12px] text-[#6B7280] mt-[3px]">
                <span>12 AM</span>
                <span>3 AM</span>
                <span>6 AM</span>
                <span>9 AM</span>
                <span>12 PM</span>
                <span>3 PM</span>
                <span>6 PM</span>
                <span>9 PM</span>
                <span>12 AM</span>
              </div>
            </div>

            {/* Enable Slots */}
            <div className="pt-2.5 border-t border-[#D1D5DB] space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-[14px] text-[#111827]">Enable Slots</label>
                  <p className="text-[13px] text-[#6B7280] mt-0.5">
                    Divide working hours into bookable time slots
                  </p>
                </div>
                <Switch
                  checked={rule.slotsEnabled}
                  onCheckedChange={(slotsEnabled) =>
                    updateRule(rule.id, { slotsEnabled })
                  }
                />
              </div>

              {/* Slot Configuration - Refined Layout */}
              {rule.slotsEnabled && totalHours > 0 && (
                <div className="bg-[#FAFAFA] rounded-xl p-3.5 border border-[#D1D5DB] space-y-2.5">
                  {/* Header with summary and accuracy indicator */}
                  <div className="flex items-center justify-between">
                    <h4 className="text-[13px] text-[#374151]">Slot Configuration</h4>
                    <div className="flex items-center gap-1.5">
                      <p className="text-[13px] text-[#6B7280]">
                        {rule.slotQuantity} slot{rule.slotQuantity !== 1 ? "s" : ""} · {formatDurationDisplay(rule.slotDurationH)} each
                      </p>
                      {(() => {
                        const totalSlotTime = rule.slotQuantity * rule.slotDurationH;
                        const difference = totalHours - totalSlotTime;
                        
                        if (Math.abs(difference) < 0.01) return null; // Exact match
                        
                        const isOverflow = difference < 0;
                        const absHours = Math.abs(difference);
                        const h = Math.floor(absHours);
                        const m = Math.round((absHours - h) * 60);
                        
                        let displayText = "";
                        if (m === 0 && h === 0) return null;
                        if (m === 0) displayText = `${h}h`;
                        else if (h === 0) displayText = `${m}m`;
                        else displayText = `${h}h ${m}m`;
                        
                        return (
                          <span className={`text-[12px] ${isOverflow ? 'text-[#F97316]' : 'text-[#10B981]'}`}>
                            ({isOverflow ? '−' : '+'}{displayText} {isOverflow ? 'overflow' : 'left'})
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Inline Mode Toggle Buttons */}
                  <div className="flex gap-2">
                    {/* Duration Button */}
                    <button
                      onClick={() => updateRule(rule.id, { mode: "duration" })}
                      className={`flex-1 h-10 px-2.5 text-[14px] rounded-lg border flex items-center justify-center gap-2 transition-all ${
                        rule.mode === "duration"
                          ? "bg-[#0066FF] text-white border-[#0066FF]"
                          : "bg-white text-[#374151] border-[#E5E7EB] hover:bg-[#F3F4F6]"
                      }`}
                    >
                      <span>Duration</span>
                      {rule.mode === "duration" && (
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              changeDuration(rule.id, false);
                            }}
                            className="w-7 h-7 flex items-center justify-center hover:bg-[#0052CC] rounded-md transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 min-w-[50px] text-center text-[14px]">
                            {formatDurationDisplay(rule.slotDurationH)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              changeDuration(rule.id, true);
                            }}
                            className="w-7 h-7 flex items-center justify-center hover:bg-[#0052CC] rounded-md transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </button>

                    {/* Quantity Button */}
                    <button
                      onClick={() => updateRule(rule.id, { mode: "quantity" })}
                      className={`flex-1 h-10 px-2.5 text-[14px] rounded-lg border flex items-center justify-center gap-2 transition-all ${
                        rule.mode === "quantity"
                          ? "bg-[#0066FF] text-white border-[#0066FF]"
                          : "bg-white text-[#374151] border-[#E5E7EB] hover:bg-[#F3F4F6]"
                      }`}
                    >
                      <span>Quantity</span>
                      {rule.mode === "quantity" && (
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              changeQuantity(rule.id, false);
                            }}
                            className="w-7 h-7 flex items-center justify-center hover:bg-[#0052CC] rounded-md transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 min-w-[40px] text-center text-[14px]">
                            {rule.slotQuantity}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              changeQuantity(rule.id, true);
                            }}
                            className="w-7 h-7 flex items-center justify-center hover:bg-[#0052CC] rounded-md transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
  );

  WorkingHoursCard.displayName = "WorkingHoursCard";

  return (
    <div className="space-y-6">
      {/* Services Section */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 hover:border-gray-300 hover:shadow-[0_8px_32px_rgba(0,102,255,0.12)] transition-all duration-300">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#E6F0FF] flex items-center justify-center">
            <Star className="w-5 h-5 text-[#0066FF]" />
          </div>
          <div>
            <h2 className="text-[16px] text-[#111827]">Services</h2>
            <p className="text-[14px] text-[#6B7280] mt-0.5">
              Add and manage your services
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between p-4 bg-[#FAFAFA] rounded-xl border border-[#E5E7EB] hover:bg-gray-100 transition-colors"
            >
              {editingId === service.id ? (
                <>
                  <div className="flex gap-3 flex-1">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Service name"
                      className="flex-1 border-[#E5E7EB] text-[#111827]"
                    />
                    <Input
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      placeholder="Price"
                      type="number"
                      className="w-24 border-[#E5E7EB] text-[#111827]"
                    />
                  </div>
                  <div className="flex gap-2 ml-3">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={saveEdit}
                      className="h-9 w-9 border-[#D1FAE5] text-[#10B981] hover:bg-[#D1FAE5]"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={cancelEdit}
                      className="h-9 w-9 border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6]"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-[15px] text-[#111827]">{service.name}</p>
                    <p className="text-[14px] text-[#6B7280] mt-0.5">${service.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => startEdit(service)}
                      className="h-9 w-9 border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6]"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => deleteService(service.id)}
                      className="h-9 w-9 border-[#FEE2E2] text-[#EF4444] hover:bg-[#FEE2E2]"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <Input
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              placeholder="Service name"
              className="flex-1 border-[#E5E7EB] text-[#111827]"
            />
            <Input
              value={newServicePrice}
              onChange={(e) => setNewServicePrice(e.target.value)}
              placeholder="Price"
              type="number"
              className="w-24 border-[#E5E7EB] text-[#111827]"
            />
            <Button onClick={addService} className="gap-2 bg-[#0066FF] hover:bg-[#0052CC]">
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Working Hours Setup Section */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] px-6 py-5 hover:border-gray-300 hover:shadow-[0_8px_32px_rgba(0,102,255,0.12)] transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6F0FF] flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#0066FF]" />
            </div>
            <div>
              <h2 className="text-[16px] text-[#111827]">Working Hours Setup</h2>
              <p className="text-[14px] text-[#6B7280] mt-0.5">
                Configure your availability schedule
              </p>
            </div>
          </div>
          {canAddRule() && (
            <Button 
              onClick={addRule} 
              variant="outline" 
              size="sm" 
              className="gap-1.5 h-8 border-[#D1D5DB] text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Schedule
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {workingRules.map((rule) => (
            <WorkingHoursCard key={rule.id} rule={rule} />
          ))}
        </div>
      </div>

      {/* Booking Settings */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 hover:border-gray-300 hover:shadow-[0_8px_32px_rgba(0,102,255,0.12)] transition-all duration-300">
        <h3 className="text-[16px] text-[#111827] mb-4">Booking Settings</h3>
        
        {/* Max Advance Booking */}
        <div className="space-y-3 mb-6">
          <label className="block text-sm text-[#6B7280]">
            Max Advance Booking
          </label>
          <div className="grid grid-cols-4 gap-3">
            {["1 week", "2 weeks", "1 month", "2 months"].map((option) => (
              <button
                key={option}
                onClick={() => setMaxAdvanceBooking(option)}
                className={`flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-all ${
                  maxAdvanceBooking === option
                    ? 'border-[#0066FF] bg-[#E6F0FF]'
                    : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <span className={`text-sm ${maxAdvanceBooking === option ? 'text-[#0066FF]' : 'text-gray-700'}`}>
                  {option}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Cancellation Policy */}
        <div className="space-y-3 mb-6">
          <label className="block text-sm text-[#6B7280]">
            Cancellation Policy
          </label>
          <div className="grid grid-cols-2 gap-3">
            {["No notice required", "24 hours notice", "48 hours notice", "72 hours notice"].map((option) => (
              <button
                key={option}
                onClick={() => setCancellationPolicy(option)}
                className={`flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-all ${
                  cancellationPolicy === option
                    ? 'border-[#0066FF] bg-[#E6F0FF]'
                    : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <span className={`text-sm ${cancellationPolicy === option ? 'text-[#0066FF]' : 'text-gray-700'}`}>
                  {option}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Allow same-day booking */}
        <div className="flex items-center justify-between p-4 bg-[#FAFAFA] rounded-xl border border-[#E5E7EB]">
          <div>
            <p className="text-[14px] text-[#111827]">Allow same-day booking</p>
            <p className="text-[13px] text-[#6B7280] mt-0.5">
              Customers can book appointments for today
            </p>
          </div>
          <Switch
            checked={sameDayBooking}
            onCheckedChange={setSameDayBooking}
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button onClick={onBack} variant="outline" className="px-8 bg-black text-white hover:bg-[#2A2A2A] hover:text-white border-black">
          Back
        </Button>
        <Button onClick={onNext} className="px-8 bg-[#0066FF] hover:bg-[#0052CC]">Continue</Button>
      </div>
    </div>
  );
}
