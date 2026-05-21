import { Tooltip } from "@chakra-ui/tooltip";

interface TooltipHorizonProps {
  extra?: string;
  trigger: React.ReactNode;
  content: string;
  placement?: any;
}

const TooltipHorizon: React.FC<TooltipHorizonProps> = ({ extra, trigger, content, placement }) => {
  return (
    <Tooltip
      placement={placement}
      label={content}
      className={`w-max rounded-xl bg-white py-3 px-4 text-sm shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none ${extra}`}
    >
      {trigger}
    </Tooltip>
  );
};

export default TooltipHorizon;
