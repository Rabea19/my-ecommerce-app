const paths = {
  bag: "M5 7h14l1 14H4L5 7Zm4 0V5a3 3 0 0 1 6 0v2",
  search: "m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  user: "M20 21v-2a7 7 0 0 0-14 0v2M17 6a5 5 0 1 1-10 0 5 5 0 0 1 10 0",
  arrow: "M4 12h16m-6-6 6 6-6 6",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "m6 6 12 12M6 18 18 6",
  check: "m5 12 4 4L19 6",
  box: "m3 7 9-5 9 5v10l-9 5-9-5V7Zm0 0 9 5 9-5M12 12v10",
  shield: "m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Zm-5 10 3 3 7-7",
};
export default function Icon({ name, className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.box} />
    </svg>
  );
}
