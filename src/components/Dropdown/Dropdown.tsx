import React, { useEffect, useRef } from 'react';
import useComponentVisible from '../../utils/use-component-visible';
import './Dropdown.scss';

interface Props {
  triggerComponent: React.ReactNode;
  dropdownComponent: (closeDropdown: Function) => React.ReactNode;
  onVisibilityChanged?: (visible: boolean) => void;
}

export default function Dropdown(props: React.PropsWithChildren<Props>) {
  const { triggerComponent, dropdownComponent } = props;
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    if (props.onVisibilityChanged) {
      props.onVisibilityChanged(isComponentVisible);
    }
  }, [isComponentVisible]);

  return (
    <div className="dropdown" ref={ref}>
      <button
        type="button"
        onClick={() => setIsComponentVisible(!isComponentVisible)}
      >
        {triggerComponent}
      </button>
      {isComponentVisible && (
        <div className="children">
          {dropdownComponent(setIsComponentVisible)}
        </div>
      )}
    </div>
  );
}
