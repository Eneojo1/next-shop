import { ReactNode, useEffect, useRef, useState } from "react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import {
  Camera,
  CheckSquare,
  Image,
  SendHorizonal,
  Smile,
  Square,
} from "lucide-react";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react";

interface FormDataType {
  user_id: number | null;
  guest: string;
  post_id: number | null;
  parent_id: number | null;
  file: File | null;
  comment: string;
}

export default function Composer() {
  const msgRef = useRef<HTMLTextAreaElement | null>(null);
  const guestRef = useRef<HTMLInputElement | null>(null);
  const mediaRef = useRef<HTMLInputElement | null>(null);
  const mojRef = useRef<HTMLDivElement | null>(null);

  const [anonymous, setAnonymous] = useState(false);
  const [openEmoji, setOpenEmoji] = useState(false);
  const [cursorPos, setCursorPos] = useState(0);
  const [activeField, setActiveField] = useState<"comment" | "guest" | null>(
    null
  );
  const { refs, floatingStyles } = useFloating({
    placement: "bottom-start",
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const [formData, setFormData] = useState<FormDataType>({
    user_id: null,
    guest: "",
    post_id: null,
    parent_id: null,
    file: null,
    comment: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, selectionStart } = e.target;
    setActiveField(name as "comment" | "guest");
    setCursorPos(selectionStart ?? value.length);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setFormData((prev) => ({
      ...prev,
      file: e.target.files![0],
    }));

    e.target.value = ""; // allow re-select same file
  };

  const onEmojiClick = (emojiData: any) => {
    if (!activeField) return;

    setFormData((prev) => {
      const text = prev[activeField] || "";
      const before = text.slice(0, cursorPos);
      const after = text.slice(cursorPos);

      return {
        ...prev,
        [activeField]: before + emojiData.emoji + after,
      };
    });

    // restore focus
    setTimeout(() => {
      const ref = activeField === "comment" ? msgRef.current : guestRef.current;
      ref?.focus();
    }, 0);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (mojRef.current && !mojRef.current.contains(e.target as Node)) {
        setOpenEmoji(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form className="bg-slate-100 relative" onSubmit={onSubmit}>
      <input
        ref={mediaRef}
        type="file"
        accept="video/*, image/*"
        className="hidden"
        onChange={handleFiles}
      />

      <Expand visible={anonymous} height="2rem">
        <input
          name="guest"
          placeholder="uuuuuuuuuuuu....."
          value={formData.guest}
          onChange={handleChange}
          onFocus={() => setActiveField("guest")}
        />
      </Expand>

      <textarea
        ref={msgRef}
        name="comment"
        value={formData.comment}
        onChange={handleChange}
        onFocus={() => setActiveField("comment")}
      />

      <div className="stickers grid grid-cols-4 gap-2 absolute z-10">
        {["🎨", "✏️", "🧩", "🔁"].map((st) => (
          <div
            key={st}
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                file: new File([], st), // convert sticker emoji to a dummy File object
              }))
            }
          >
            {st}
          </div>
        ))}
      </div>

      <div className="no-entry">Hover me</div>

      <div className="flex justify-between [&_span]:cursor-pointer text-red-500">
        <div className="flex gap-2">
          <div ref={mojRef}>
            <span
              onClick={() => setOpenEmoji(!openEmoji)}
              ref={refs.setReference}
            >
              <Smile size={20} />
              {openEmoji && (
                <div
                  ref={refs.setFloating}
                  style={floatingStyles}
                  className="z-10"
                >
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    width={300}
                    height={350}
                    theme={Theme.DARK}
                  />
                </div>
              )}
            </span>
          </div>
          <span onClick={() => mediaRef.current?.click()}>
            <Camera size={20} />
          </span>
          <span onClick={() => mediaRef.current?.click()}>
            <Image size={20} />
          </span>
          <button>
            <SendHorizonal size={20} />
          </button>
        </div>
        <span
          className="flex gap-1 items-center text-sm"
          onClick={() => setAnonymous(!anonymous)}
        >
          {anonymous ? <CheckSquare size={15} /> : <Square size={15} />}
          Anonymous
        </span>
      </div>
    </form>
  );
}

interface ExpandProps {
  visible?: boolean;
  height?: string;
  children: ReactNode;
  classNme?: string;
}

const Expand = ({
  visible = false,
  height = "auto",
  children,
  classNme = "",
}: ExpandProps) => {
  const baseClass =
    "overflow-hidden tansition-all duration-500 ease-in-out mt-2";
  const stateClasses = visible ? "h-0 p-0 opacity-0" : "opacity-100";
  return (
    <div
      className={`${baseClass} ${stateClasses} ${classNme}`}
      style={{ height: visible ? "0px" : height }}
    >
      {children}
    </div>
  );
};
