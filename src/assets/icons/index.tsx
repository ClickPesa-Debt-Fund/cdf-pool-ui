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
      strokeWidth="0.125"
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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
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
      strokeWidth="2"
      stroke-miterlimit="10"
    />
    <path
      d="M21.5 4.5H10.5C7.18629 4.5 4.5 7.18629 4.5 10.5V21.5C4.5 24.8137 7.18629 27.5 10.5 27.5H21.5C24.8137 27.5 27.5 24.8137 27.5 21.5V10.5C27.5 7.18629 24.8137 4.5 21.5 4.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 14V22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 14V22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 17.5C15 16.5717 15.3687 15.6815 16.0251 15.0251C16.6815 14.3687 17.5717 14 18.5 14C19.4283 14 20.3185 14.3687 20.9749 15.0251C21.6313 15.6815 22 16.5717 22 17.5V22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 11.5C11.8284 11.5 12.5 10.8284 12.5 10C12.5 9.17157 11.8284 8.5 11 8.5C10.1716 8.5 9.5 9.17157 9.5 10C9.5 10.8284 10.1716 11.5 11 11.5Z"
      fill="currentColor"
    />
  </svg>
);

export const Gasicon = ({ size, style, className }: BaseIconProps) => (
  <svg
    width={size || "15"}
    height={size || "15"}
    className={className}
    style={style}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.467 3.83467C14.4704 3.70144 14.4462 3.56895 14.3959 3.44556C14.3455 3.32217 14.2701 3.21055 14.1745 3.11775C13.763 2.71267 13.3547 2.30117 12.9464 1.89287L11.3068 0.259708C11.2538 0.18604 11.1855 0.124808 11.1064 0.0802841C11.0274 0.0357597 10.9396 0.00901437 10.8491 0.00191355C10.7587 -0.00518727 10.6678 0.0075274 10.5828 0.0391707C10.4978 0.0708139 10.4207 0.120624 10.3569 0.185127C10.2931 0.24963 10.2441 0.327272 10.2134 0.41264C10.1827 0.498007 10.171 0.589044 10.1791 0.6794C10.1872 0.769757 10.2149 0.857258 10.2603 0.9358C10.3057 1.01434 10.3677 1.08204 10.442 1.13416C10.8181 1.51352 11.2007 1.90573 11.5736 2.26259V2.32046C11.0551 2.47453 10.6095 2.8102 10.3183 3.26601C10.027 3.72182 9.90972 4.26727 9.9878 4.8025C10.0659 5.33774 10.3341 5.82694 10.7434 6.18056C11.1527 6.53418 11.6757 6.72854 12.2166 6.72808C12.5709 6.7292 12.9204 6.64542 13.2357 6.48374V10.6792C13.2357 11.4218 13.2357 12.1645 13.2357 12.9071C13.2357 13.1262 13.1487 13.3364 12.9937 13.4913C12.8388 13.6463 12.6286 13.7333 12.4095 13.7333C12.1904 13.7333 11.9802 13.6463 11.8253 13.4913C11.6703 13.3364 11.5833 13.1262 11.5833 12.9071C11.5833 12.6981 11.5833 12.4924 11.5833 12.2866C11.5833 11.1035 11.5833 9.92047 11.5833 8.75025C11.5746 8.41794 11.4656 8.09604 11.2705 7.82691C11.0754 7.55777 10.8033 7.35402 10.4902 7.24246C10.158 7.14904 9.81203 7.11423 9.46786 7.13958H9.09494V6.85667C9.09494 5.15921 9.09494 3.46389 9.09494 1.77071C9.10019 1.54901 9.0605 1.32855 8.97827 1.12261C8.89603 0.916661 8.77296 0.729496 8.61645 0.572391C8.45995 0.415285 8.27326 0.291492 8.06763 0.20847C7.862 0.125448 7.64169 0.0849169 7.41998 0.0893187C5.49104 0.0893187 3.57175 0.0893187 1.6621 0.0893187C1.44471 0.0876232 1.22913 0.128924 1.02776 0.210846C0.826385 0.292767 0.643197 0.413693 0.488729 0.566667C0.33426 0.719642 0.21156 0.901646 0.127686 1.10221C0.043811 1.30278 0.000417165 1.51795 0 1.73534C0 2.25294 0 2.77054 0 3.28814V9.39644C0 11.2225 0 13.0507 0 14.881C0 14.9196 0 14.955 0 15H9.09815V8.39339C9.1303 8.39339 9.13995 8.37089 9.1528 8.37089H9.83758C10.1848 8.37089 10.3423 8.52842 10.3423 8.87884C10.3423 10.2195 10.3423 11.5601 10.3423 12.9007C10.3473 13.2028 10.4167 13.5004 10.5459 13.7737C10.6751 14.0469 10.861 14.2894 11.0913 14.485C11.3217 14.6806 11.5911 14.8249 11.8816 14.9082C12.1721 14.9914 12.477 15.0118 12.776 14.9679C13.2072 14.8891 13.6026 14.6764 13.9062 14.3602C14.2097 14.044 14.4059 13.6402 14.467 13.2061C14.5056 12.7849 14.4927 12.3606 14.4927 11.9394C14.4756 9.23677 14.467 6.53518 14.467 3.83467ZM7.42319 5.8697H1.63638V1.75785H7.42319V5.8697ZM12.4867 5.73146C12.382 5.76096 12.2739 5.77611 12.1652 5.77647C11.9069 5.77905 11.6551 5.6959 11.4492 5.54004C11.2433 5.38418 11.0949 5.16441 11.0272 4.91517C10.9596 4.66593 10.9765 4.40129 11.0754 4.16271C11.1743 3.92413 11.3495 3.72509 11.5736 3.59677C11.7511 3.49308 11.9531 3.4387 12.1587 3.43924C12.441 3.43922 12.7137 3.54122 12.9267 3.72644C13.1397 3.91166 13.2786 4.16762 13.3177 4.44715C13.3569 4.72667 13.2937 5.01093 13.1398 5.24754C12.9859 5.48414 12.7516 5.65715 12.4802 5.73467L12.4867 5.73146Z"
      fill="currentColor"
    />
  </svg>
);

export const DebtfundIcon = ({}: BaseIconProps) => <></>;
