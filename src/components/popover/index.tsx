import { Popover, PopoverTrigger, PopoverContent } from "@chakra-ui/popover";

interface PopoverHorizonProps {
  extra?: string;
  trigger: React.ReactNode;
  content: React.ReactNode;
}

const PopoverHorizon: React.FC<PopoverHorizonProps> = ({ extra, trigger, content }) => {
  return (
    <Popover>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent
        className={`w-max rounded-xl bg-white py-3 px-4 text-sm shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none ${extra}`}
      >
        {content}
      </PopoverContent>
    </Popover>
  );
};

export default PopoverHorizon;
