import { useEffect } from 'react';
import { Prompt } from 'react-router-dom';

interface Props {
  /** Set to true to enable the prompt */
  when: boolean;
  /** Message to display when the user navigates away by clicking a local link.
   * This is also used as a requested message for onbeforeunload when the user refreshes the page or tries to close the tab.
   * NOTE: Most browsers don't display a requested message when onbeforeunload fires, so the message
   * is primarily useful to prompt the user when they're navigating away via a local React Router link. */
  message: string;
}

// Prompt the user onbeforeunload or when navigating away by clicking a link
export const PromptOnUnload: React.FC<Props> = ({ when: enabled, message = 'Are you sure you want to leave?' }) => {
  useEffect(() => {
    if (enabled) {
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        event.returnValue = ''; // Chrome requires setting this.
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [enabled]);

  return <Prompt when={enabled} message={message} />;
};
