'use client';

import { useSiteMode } from '@/contexts/SiteModeContext';
import { useEffect, useMemo, useRef } from 'react';
import { Chart, ChartConfiguration, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

// Register required Chart.js components
Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const SkillsRadar = () => {
  const { mode } = useSiteMode();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const theme = useMemo(() => {
    if (mode === 'cyber') {
      return {
        label: 'Cybernetic Skill Signal',
        fill: 'rgba(38, 255, 230, 0.16)',
        border: 'rgb(38, 255, 230)',
        point: 'rgb(255, 63, 215)',
        pointBorder: 'rgb(234, 255, 255)',
        grid: 'rgba(38, 255, 230, 0.18)',
        angle: 'rgba(255, 63, 215, 0.14)',
        text: 'rgba(234, 255, 255, 0.92)',
        tick: 'rgba(234, 255, 255, 0.46)',
        tooltipBg: 'rgba(3, 8, 18, 0.92)',
      };
    }

    return {
      label: 'Hand-drawn Skill Map',
      fill: 'rgba(23, 20, 16, 0.08)',
      border: 'rgb(23, 20, 16)',
      point: 'rgb(23, 20, 16)',
      pointBorder: 'rgb(247, 241, 229)',
      grid: 'rgba(23, 20, 16, 0.2)',
      angle: 'rgba(23, 20, 16, 0.18)',
      text: 'rgba(23, 20, 16, 0.9)',
      tick: 'rgba(23, 20, 16, 0.5)',
      tooltipBg: 'rgba(247, 241, 229, 0.96)',
    };
  }, [mode]);

  const skillsData = useMemo(() => ({
    labels: [
      'Python',
      'Java', 
      'JavaScript',
      'PHP/Hack',
      'React',
      'Spring Boot',
      'Machine Learning',
      'GraphQL',
      'AWS',
      'System Design'
    ],
    datasets: [{
      label: theme.label,
      data: [9, 9, 8, 7, 9, 9, 10, 8, 7, 8],
      fill: true,
      backgroundColor: theme.fill,
      borderColor: theme.border,
      pointBackgroundColor: theme.point,
      pointBorderColor: theme.pointBorder,
      pointHoverBackgroundColor: theme.pointBorder,
      pointHoverBorderColor: theme.point,
      borderWidth: mode === 'cyber' ? 2 : 2.5,
      pointRadius: mode === 'cyber' ? 4 : 3.5,
      pointHoverRadius: 6,
    }]
  }), [mode, theme]);

  const options = useMemo<ChartConfiguration<'radar'>['options']>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
        angleLines: {
          color: theme.angle
        },
        grid: {
          color: theme.grid,
          circular: mode === 'sketch',
        },
        pointLabels: {
          color: theme.text,
          font: {
            size: 12,
            family: mode === 'cyber'
              ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
              : 'Georgia, Times New Roman, serif',
            weight: mode === 'cyber' ? 'bold' : 'normal',
          }
        },
        ticks: {
          color: theme.tick,
          backdropColor: 'transparent',
          stepSize: 2
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: theme.tooltipBg,
        titleColor: theme.text,
        bodyColor: theme.text,
        borderColor: theme.border,
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed.r}/10`;
          }
        }
      }
    }
  }), [mode, theme]);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'radar',
          data: skillsData,
          options
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [options, skillsData]);

  return (
    <div className="theme-card theme-radar-card p-6 h-96">
      <div className="flex items-baseline justify-between gap-4 mb-4">
        <h3 className="theme-card-title text-xl">Technical Skills</h3>
        <span className="theme-radar-mode">{mode === 'cyber' ? 'signal map' : 'sketch map'}</span>
      </div>
      <div className="relative h-80">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default SkillsRadar;
