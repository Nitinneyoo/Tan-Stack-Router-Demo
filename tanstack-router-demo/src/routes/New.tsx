import { createFileRoute } from "@tanstack/react-router";
// import { useState } from "react";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Pause,
  ArrowRight,
  CodeXml,
  Bolt,
  Wifi,
  BatteryFull,
  Lightbulb,
} from "lucide-react";
import { Drawer } from 'vaul';

export const Route = createFileRoute("/New")({
  component: NewComponent,
});

const robot = {
  charge: 35,
  health: {
    software: 2,
    hardware: 3,
    network: 1,
  },
};

const getSeverityColor = (severity: number) => {
  switch (severity) {
    case 1: return 'bg-green-500';
    case 2: return 'bg-yellow-500';
    case 3: return 'bg-red-500';
    case 4: return 'bg-gray-300 border border-gray-400';
    default: return 'bg-gray-200 border border-gray-300';
  }
};

const getBatteryStatus = (charge: number) => {
  if (charge >= 70) return { filled: 3, color: 'bg-green-500' };
  if (charge >= 30) return { filled: 3, color: 'bg-orange-500' };
  return { filled: 3, color: 'bg-red-500' };
};

function NewComponent() {

  return (
    <div className="p-4">
      <Drawer.Root direction="right">
        <Drawer.Trigger className="text-black"> open Drawer </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 " />
          <Drawer.Content className="bg-gray-100 fixed bottom-0 top-0 right-0 outline-none lg:max-w-1/2 sm:min-w-1/3 z-1000 md-max-w-1/2 ">
            <div className="flex h-full flex-col">
              {/* Header */}
              <Card className="border-b p-4 pb-2">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <Drawer.Title className="font-semibold text-lg">
                        AR6500022025
                      </Drawer.Title>
                      <div className="space-y-1 text-muted-foreground text-sm">
                        <div>Model: AR250</div>
                        <div>Type: Lifter</div>
                        <div>Onboarding Date: 28-Apr-2025</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-end items-end gap-2 sm:pt-6">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700"
                    >
                      Active
                    </Badge>
                    <div className="flex items-center gap-2">
                      <BatteryFull color="green" />
                      <span className="font-medium text-sm">{robot.charge}%</span>

                    </div>
                  </div>
                </div>
              </Card>

              {/* Scrollable Main Section */}
              <div className="flex-1 overflow-y-auto space-y-6 p-4">

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button className="h-12 bg-[#C53030] hover:bg-red-600 w-full">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Emergency Stop
                  </Button>
                  <Button className="h-12 bg-slate-600 text-white hover:bg-slate-700 w-full">
                    <Pause className="mr-2 h-4 w-4" />
                    Pause Robot
                  </Button>
                </div>

                {/* Robot Uptime */}
                <Card className="rounded-xl border border-[#E2E8F0] shadow-sm">

                  <CardContent className="grid grid-cols-2 gap-4 p-0">
                    <Card className="rounded-lg border shadow-none">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <Lightbulb className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Today</div>
                          <div className="text-lg font-bold">12 Hrs</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-lg border shadow-none">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Lightbulb className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Average Uptime</div>
                          <div className="text-lg font-bold">8 Hrs/day</div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
                {/* Robot Health */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Robot Health</h2>
                  <Card className="rounded-xl  shadow-sm bg-[#F1F5F9]" >
                    <CardContent >
                      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 ">
                        {[
                          { label: "Software", icon: <CodeXml />, value: robot.health.software },
                          { label: "Hardware", icon: <Bolt />, value: robot.health.hardware },
                          { label: "Battery", icon: <BatteryFull />, value: robot.charge },
                          { label: "Network", icon: <Wifi />, value: robot.health.network },
                        ].map((item, idx) => (
                          <div key={idx} className="flex flex-col items-center p-2  rounded-md bg-white shadow-md">
                            <div className="flex items-center gap-1 text-sm font-medium text-gray-700 p-4">
                              {item.icon}
                              {item.label}
                            </div>
                            <div className="flex gap-1">
                              {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-6 h-4 rounded ${item.label === "Battery"
                                    ? i < getBatteryStatus(robot.charge).filled
                                      ? getBatteryStatus(robot.charge).color
                                      : "bg-white border border-gray-300"
                                    : getSeverityColor(item.value)
                                    }`}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>




                {/* Current Transport Order */}
                <Card className="rounded-xl border border-[#E2E8F0] shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Current Transport Order</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div>
                        <div className="text-muted-foreground">Request ID</div>
                        <div className="font-medium">112345</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Pickup Location</div>
                        <div className="font-medium">Waypoint 1</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Drop Location</div>
                        <div className="font-medium">Buffer Loc 1</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Requested at</div>
                        <div className="font-medium">12 Feb 25, 12:15 PM</div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <div className="rounded bg-blue-50 px-2 py-1 font-medium text-blue-600 text-xs">REQUESTED</div>
                      </div>
                      <div className="mt-3 flex items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <div className="mx-2 h-0.5 flex-1 bg-gray-300"></div>
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <div className="mx-2 h-0.5 flex-1 bg-gray-300"></div>
                        <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                        <div className="mx-2 h-0.5 flex-1 bg-gray-300"></div>
                        <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Footer */}
              <div className="border-t p-4">
                <Button className="h-12 w-full bg-slate-800 hover:bg-slate-900">
                  Access Single Robot UI
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}
