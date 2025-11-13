import { Button } from '../../../shared/components/ui/Button';

interface KeypadProps {
  onInput: (value: string) => void;
  onClear: () => void;
}

const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '000', '⌫'];

export function Keypad({ onInput, onClear }: KeypadProps): JSX.Element {
  return (
    <div className="keypad">
      {keys.map((key) => (
        <Button
          key={key}
          variant={key === '⌫' ? 'secondary' : 'ghost'}
          onClick={() => {
            if (key === '⌫') {
              onClear();
            } else {
              onInput(key);
            }
          }}
        >
          {key}
        </Button>
      ))}
    </div>
  );
}
