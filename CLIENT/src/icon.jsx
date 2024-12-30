import { ShareIcon } from "@heroicons/react/24/outline";
import { Checkbox } from "@mui/material";

// BrandColor : #74C79E
export const Share = (props) => (
  <ShareIcon
    style={{
      ...props.style, // 추가적인 스타일 속성 병합
    }}
    strokeWidth={1.8}
    className={`w-6 text-emerald-400 ${props.className}`} // Tailwind 클래스도 병합 가능
  />
);

export const CustomCheckbox = (props) => (
  <Checkbox
    {...props}
    sx={{
      color: "#34d399", // emerald-400(tailwind color)
      "&.Mui-checked": {
        color: "#10b981", // emerald-500(tailwind color)
      },
    }}
  />
);
