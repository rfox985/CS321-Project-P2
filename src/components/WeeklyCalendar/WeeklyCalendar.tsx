"use client";
import "./WeeklyCalendar.css";
import React, { useState, useEffect } from "react";
import {
  format,
  subMonths,
  addMonths,
  startOfWeek,
  addDays,
  isSameDay,
  lastDayOfWeek,
  getWeek,
  addWeeks,
  subWeeks
} from "date-fns";



export const WeeklyCalendar = () => {
    return (
        <div className="WeeklyCalendar-card">
            <p className="card-text">Your Weekly Calendar</p>
        </div>
    );
};
