import { cn } from "@/lib/utils";

interface RoundedProgressBarProps {
  percent: number;
  diameter?: number; // Diameter of the circle
  strokeWidth?: number; // Width of the stroke (thickness of the progress bar)
  ringClassName?: string; // Background color of the progress bar
  progressClassName?: string; // Color of the progress bar
  textClassName?: string;
  animationDuration?: number; // Animation duration for the progress bar (in milliseconds)
  textFontSize?: number; // Font size for the progress text
  value?: number;
}

const RoundedProgressBar = ({
  percent,
  value,
  diameter = 10,
  strokeWidth = 1.2,
  ringClassName = "text-black/5",
  progressClassName = "text-primary",
  textClassName = "text-black/95",
  animationDuration = 1000, // Default animation duration in milliseconds
  textFontSize = strokeWidth * 0.9, // Default font size based on stroke width
}: RoundedProgressBarProps) => {
  const radius = diameter / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <svg className="w-full" viewBox={`0 0 ${diameter} ${diameter}`}>
      <circle
        className={cn("rounded-full", ringClassName)}
        cx={diameter / 2}
        cy={diameter / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        stroke={"currentColor"}
        strokeLinecap="round" // Rounded edges
      />
      <circle
        className={cn("rounded-full", progressClassName)}
        cx={diameter / 2}
        cy={diameter / 2}
        r={radius}
        fill="none"
        strokeWidth={percent === 0 ? 0 : strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset} // Set initial dash offset to hide the progress
        stroke={"currentColor"}
        strokeLinecap="round" // Rounded edges
      >
        <animate
          attributeName="stroke-dashoffset"
          values={`${circumference};${strokeDashoffset}`}
          dur={`${animationDuration / 1000}s`}
          repeatCount="1"
          fill="freeze"
        />
      </circle>
      {value !== undefined && (
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="currentColor"
          fontSize={`${textFontSize}px`}
          fontWeight="bold"
          className={cn(textClassName)}
        >
          {value}%
        </text>
      )}
    </svg>
  );
};

export default RoundedProgressBar;
