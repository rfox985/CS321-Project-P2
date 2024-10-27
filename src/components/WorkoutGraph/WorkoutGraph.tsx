"use client";

import { AreaChart } from "@/components/tremor/AreaChart";
import './WorkoutGraph.css';

const chartdata = [
    {
        date: "Jan 23",
        Current: 2890,
        Previous: 2338,
    },
    {
        date: "Feb 23",
        Current: 2756,
        Previous: 2103,
    },
    {
        date: "Mar 23",
        Current: 3322,
        Previous: 2194,
    },
    {
        date: "Apr 23",
        Current: 3470,
        Previous: 2108,
    },
    {
        date: "May 23",
        Current: 3475,
        Previous: 1812,
    },
    {
        date: "Jun 23",
        Current: 3129,
        Previous: 1726,
    },
    {
        date: "Jul 23",
        Current: 3490,
        Previous: 1982,
    },
    {
        date: "Aug 23",
        Current: 2903,
        Previous: 2012,
    },
    {
        date: "Sep 23",
        Current: 2643,
        Previous: 2342,
    },
    {
        date: "Oct 23",
        Current: 2837,
        Previous: 2473,
    },
    {
        date: "Nov 23",
        Current: 2954,
        Previous: 3848,
    },
    {
        date: "Dec 23",
        Current: 3239,
        Previous: 3736,
    },
];

export const WorkoutGraph = () => (
  <div className="graph-card">
    <p className="card-text">Workout Length</p>
      <AreaChart
          data={chartdata}
          index="date"
          categories={["Current", "Previous"]}
          colors={["hot_pink", "hot_orange"]}
          valueFormatter={(number: number) =>
              `${Intl.NumberFormat("us").format(number).toString()}`
          }
          onValueChange={(v) => console.log(v)}
      />
    </div>
);
