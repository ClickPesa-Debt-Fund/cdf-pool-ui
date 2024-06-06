import { CSSProperties } from "react";

export type BaseIconProps = {
  size?: number;
  className?: string;
  style?: CSSProperties;
};

export const ArrowBgIcon = ({ size, style, className }: BaseIconProps) => (
  <svg
    width={size || "14"}
    height={size || "13"}
    className={className}
    style={style}
    viewBox="0 0 14 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.1875 6.10739L5.6505 8.65039L5.64903 8.65186L5.64901 8.65184C5.54098 8.75318 5.39896 8.81048 5.25085 8.8125L5.24974 8.81251C5.10097 8.81187 4.95811 8.75423 4.85056 8.65143L4.84933 8.65025L4.84934 8.65023C4.74386 8.54373 4.68469 8.3999 4.68469 8.25C4.68469 8.10011 4.74386 7.95627 4.84934 7.84977L4.84961 7.84951L7.39261 5.3125H5.75C5.60082 5.3125 5.45774 5.25324 5.35225 5.14775C5.24676 5.04226 5.1875 4.89919 5.1875 4.75C5.1875 4.60082 5.24676 4.45774 5.35225 4.35226C5.45774 4.24677 5.60082 4.1875 5.75 4.1875H8.74984H8.75V4.25C8.81438 4.24984 8.87814 4.26259 8.9375 4.2875L8.1875 6.10739ZM8.1875 6.10739V7.75C8.1875 7.89919 8.24676 8.04226 8.35225 8.14775C8.45774 8.25324 8.60082 8.3125 8.75 8.3125C8.89918 8.3125 9.04226 8.25324 9.14775 8.14775C9.25324 8.04226 9.3125 7.89919 9.3125 7.75L9.3125 4.75L9.3125 4.74973C9.31218 4.67556 9.29796 4.60212 9.27059 4.53319L9.27061 4.53318L9.26989 4.53149C9.21067 4.39426 9.09982 4.28585 8.96131 4.22972L8.1875 6.10739ZM11.5496 11.0495L11.5495 11.0496C10.6495 11.9506 9.50246 12.5644 8.25352 12.8133C7.00459 13.0623 5.70987 12.9352 4.53317 12.4481C3.35647 11.9611 2.35067 11.136 1.643 10.0772C0.935339 9.01841 0.557613 7.77351 0.557613 6.5C0.557613 5.22649 0.935339 3.9816 1.643 2.92281C2.35067 1.86402 3.35647 1.03891 4.53317 0.551874C5.70987 0.0648359 7.00459 -0.0622483 8.25352 0.186699C9.50246 0.435646 10.6495 1.04944 11.5495 1.95042L11.5938 1.90625L11.5496 1.95047C12.1474 2.54773 12.6216 3.25696 12.9451 4.03759C13.2687 4.81823 13.4352 5.65497 13.4352 6.5C13.4352 7.34503 13.2687 8.18178 12.9451 8.96241C12.6216 9.74305 12.1474 10.4523 11.5496 11.0495Z"
      fill="currentColor"
      stroke="currentColor"
      stroke-width="0.125"
    />
  </svg>
);

export const TwitterIcon = ({ size, style, className }: BaseIconProps) => (
  <svg
    width={size || "32"}
    height={size || "32"}
    className={className}
    style={style}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 11C16 8.24997 18.3125 5.96247 21.0625 5.99997C22.0256 6.01108 22.9649 6.30011 23.7676 6.83231C24.5704 7.36451 25.2023 8.11722 25.5875 8.99997H30L25.9625 13.0375C25.7019 17.0932 23.9066 20.8974 20.9415 23.6768C17.9764 26.4562 14.0641 28.002 10 28C6 28 5 26.5 5 26.5C5 26.5 9 25 11 22C11 22 3 18 5 6.99997C5 6.99997 10 12 16 13V11Z"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export const InstagramIcon = ({ size, style, className }: BaseIconProps) => (
  <svg
    width={size || "32"}
    height={size || "32"}
    className={className}
    style={style}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 21C18.7614 21 21 18.7614 21 16C21 13.2386 18.7614 11 16 11C13.2386 11 11 13.2386 11 16C11 18.7614 13.2386 21 16 21Z"
      stroke="currentColor"
      stroke-width="2"
      stroke-miterlimit="10"
    />
    <path
      d="M21.5 4.5H10.5C7.18629 4.5 4.5 7.18629 4.5 10.5V21.5C4.5 24.8137 7.18629 27.5 10.5 27.5H21.5C24.8137 27.5 27.5 24.8137 27.5 21.5V10.5C27.5 7.18629 24.8137 4.5 21.5 4.5Z"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M22.5 11C23.3284 11 24 10.3284 24 9.5C24 8.67157 23.3284 8 22.5 8C21.6716 8 21 8.67157 21 9.5C21 10.3284 21.6716 11 22.5 11Z"
      fill="currentColor"
    />
  </svg>
);

export const LinkedInIcon = ({ size, style, className }: BaseIconProps) => (
  <svg
    width={size || "32"}
    height={size || "32"}
    className={className}
    style={style}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M26.5 4.5H5.5C4.94772 4.5 4.5 4.94772 4.5 5.5V26.5C4.5 27.0523 4.94772 27.5 5.5 27.5H26.5C27.0523 27.5 27.5 27.0523 27.5 26.5V5.5C27.5 4.94772 27.0523 4.5 26.5 4.5Z"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M15 14V22"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M11 14V22"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M15 17.5C15 16.5717 15.3687 15.6815 16.0251 15.0251C16.6815 14.3687 17.5717 14 18.5 14C19.4283 14 20.3185 14.3687 20.9749 15.0251C21.6313 15.6815 22 16.5717 22 17.5V22"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M11 11.5C11.8284 11.5 12.5 10.8284 12.5 10C12.5 9.17157 11.8284 8.5 11 8.5C10.1716 8.5 9.5 9.17157 9.5 10C9.5 10.8284 10.1716 11.5 11 11.5Z"
      fill="currentColor"
    />
  </svg>
);
