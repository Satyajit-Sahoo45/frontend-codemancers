import React, { FC } from "react";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem?: any;
  component: any;
  setRoute?: (route: string) => void;
  refetch?: any;
};

const CustomModal: FC<Props> = ({
  open,
  setOpen,
  setRoute,
  component: Component,
  refetch,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[95%] max-w-lg p-6">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 dark:text-gray-300"
        >
          &times;
        </button>

        <Component setOpen={setOpen} setRoute={setRoute} refetch={refetch} />
      </div>
    </div>
  );
};

export default CustomModal;
