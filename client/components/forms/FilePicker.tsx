import { useState, useRef, useCallback } from 'react';
import { Flex } from '~/components/layout/Flex';
import { Button } from '~/components/forms/Button';
import { styled } from '~/theme/stitches.config';
import { Icon } from '~/components/ui/Icon';
import '~/theme/icons/fa/duotone/folder-open';

// Based on: https://evergreen.segment.com/components/filepicker/

const FileList = styled('input', {
  background: 'white',
  border: '1px solid $neutral12',
  borderRight: 'none',
  px: '$sm',
  lineHeight: '2.5rem',
  borderRadius: '$rounded 0 0 $rounded',
  cursor: 'pointer',
  userSelect: 'none',
  // pointerEvents: 'none',
  textOverflow: 'ellipsis',
  width: 170,

  '@sm': {
    width: 300,
  },

  '&:active': {
    filter: 'brightness(.9)',
  },
  '&::placeholder': {
    color: '$neutral9',
    fontStyle: 'italic',
  },
  '&:focus': {
    outline: 'none',
  },
});

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  // label: string; // customize button label?
}

export type FileEventTarget = EventTarget & { files: FileList };

export const FilePicker: React.FC<Props> = ({ disabled, placeholder = 'Select a file…', onChange, ...rest }) => {
  const [files, setFiles] = useState<File[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFiles(
        e.target.files && e.target.files.length
          ? [...Array.from(e.target.files)] // Firefox returns the same array instance each time for some reason
          : null
      );

      if (onChange != null) {
        onChange(e);
      }
    },
    [onChange]
  );

  const handleButtonClick = useCallback(() => {
    if (fileInputRef && fileInputRef.current != null) {
      fileInputRef.current.click();
    }
  }, [fileInputRef]);

  let inputValue;
  if (files === null) {
    inputValue = '';
  } else if (files.length === 1) {
    inputValue = files[0].name;
  } else {
    inputValue = `${files.length} files`;
  }

  const folderButtonTitle = 'Select file to upload';

  return (
    <Flex>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{
          display: 'none',
        }}
        {...rest}
      />

      <FileList
        size={15}
        readOnly
        tabIndex={-1}
        value={inputValue}
        onClick={handleButtonClick}
        placeholder={placeholder}
      />

      <Button
        disabled={disabled}
        onClick={handleButtonClick}
        // onBlur={handleBlur}
        css={{
          borderLeft: 'none',
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        }}
        title={folderButtonTitle}
        aria-label={folderButtonTitle}
      >
        <Icon name="fa/duotone/folder-open" />
      </Button>
    </Flex>
  );
};
