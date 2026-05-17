'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Chart, ChartConfiguration, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

// Register required Chart.js components
Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const SkillsRadar = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

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
      label: 'Technical Skills',
      data: [9, 9, 8, 7, 9, 9, 10, 8, 7, 8],
      fill: true,
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgb(59, 130, 246)',
      pointBackgroundColor: 'rgb(59, 130, 246)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(59, 130, 246)',
      borderWidth: 2,
      pointRadius: 4,
    }]
  }), []);

  const options = useMemo<ChartConfiguration<'radar'>['options']>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        pointLabels: {
          color: '#fff',
          font: {
            size: 12
          }
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed.r}/10`;
          }
        }
      }
    }
  }), []);

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
    <div className="bg-gray-900 rounded-lg p-6 h-96">
      <h3 className="text-xl font-semibold text-white mb-4 text-center">Technical Skills</h3>
      <div className="relative h-80">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default SkillsRadar;
