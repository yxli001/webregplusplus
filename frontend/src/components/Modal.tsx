import { useEffect, useRef } from "react";

import Cross from "@/icons/Cross";

type BaseModalProps = {
  open: boolean;
  disableClose?: boolean;
  useOverlay?: boolean;
  children?: React.ReactNode;
  backdropOpacity?: number;

  // passed to the modal container within the backdrop
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

type EnableCloseModalProps = {
  disableClose?: false;
  onClose: () => void;
} & BaseModalProps;

type DisableCloseModalProps = {
  disableClose: true;
} & BaseModalProps;

type ModalProps = EnableCloseModalProps | DisableCloseModalProps;

/**
 * A modal component that can be used to display content on top of the current page, backdrop has an opacity of 50%.
 *
 * `className` and all additional props will be passed to the modal container (the white box on top of the backdrop).
 *
 * @param {boolean} props.isOpen - boolean to indicate if the modal should be open
 * @param {boolean} props.disableClose - disable the close button and close by esc
 * @param {() => void} props.onClose - callback function called when close button is pressed, backdrop is clicked, or escape key is pressed
 * @param {boolean} props.useOverlay - boolean to indicate if backdrop should be visible and if clicking outside the modal should close the modal
 * @param {number} props.backdropOpacity - opacity of the backdrop in percentage, default is 50
 * @param {React.ReactNode} props.children - children to be rendered inside the modal
 *
 * @returns {React.JSX.Element} The rendered modal component.
 */
const Modal = (props: ModalProps): React.JSX.Element => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const {
    open: isOpen,
    disableClose,
    useOverlay = true,
    backdropOpacity = 50,
    className,
    children,
    ...restProps
  } = props;

  useEffect(() => {
    // Close modal when escape key is pressed
    if (!disableClose) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          props.onClose();
        }
      };

      // Close modal when clicking outside the modal
      const handleClickOutside = (e: MouseEvent) => {
        if (backdropRef.current === e.target) {
          props.onClose();
        }
      };

      document.addEventListener("keydown", handleEscape);

      // add backdrop click listener if useOverlay is true
      if (useOverlay) {
        document.addEventListener("mousedown", handleClickOutside);
        // "click" event has weird behavior where if you drag a click from inside the modal to outside, it will trigger the click event
      }

      return () => {
        document.removeEventListener("keydown", handleEscape);

        if (useOverlay) {
          document.removeEventListener("mousedown", handleClickOutside);
        }
      };
    }
  }, [useOverlay, disableClose, props]);

  if (!isOpen) return <></>;

  return (
    // backdrop
    <div
      className={`absolute left-0 top-0 flex h-[100vh] w-[100vw] items-center justify-center ${
        !disableClose && "hover:cursor-pointer"
      } z-50 transition`}
      style={{
        backgroundColor: useOverlay
          ? "#000000" + backdropOpacity.toString()
          : "",
      }}
      ref={backdropRef}
    >
      {/* modal container */}
      <div
        {...restProps}
        className={`relative mx-auto w-[50%] bg-white p-2 hover:cursor-default ${className}`}
      >
        {!disableClose && (
          <Cross
            className="hover:text-primary absolute right-2 top-2 transition hover:cursor-pointer"
            size={20}
            onClick={() => {
              props.onClose();
            }}
          />
        )}

        {children}
      </div>
    </div>
  );
};

export default Modal;
