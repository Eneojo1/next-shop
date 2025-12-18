import {
  ReactEventHandler,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import EmojiPicker from "emoji-picker-react";
import {
  Camera,
  CheckSquare,
  Image,
  Send,
  SendHorizonal,
  Smile,
  Square,
} from "lucide-react";

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

  const [emojiPosition, setEmojiPosition] = useState({ x: 0, y: 0 });
  const [anonymous, setAnonymous] = useState(false);
  const [openEmoji, setOpenEmoji] = useState(false);
  const [cursorPos, setCursorPos] = useState(0);
  const [activeField, setActiveField] = useState<"comment" | "guest" | null>(
    null
  );

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

  const updateEmojiPosition = () => {
    const textarea = msgRef.current;
    if (!textarea) return;

    const rect = textarea.getBoundingClientRect();
    const pickerHeight = 300; // approximate emoji picker height
    const viewportHeight = window.innerHeight;

    // If not enough space below, show above
    const top =
      rect.bottom + pickerHeight > viewportHeight
        ? rect.top - pickerHeight
        : rect.bottom;

    setEmojiPosition({ x: rect.left, y: top });
  };

  // Open emoji picker
  const handleOpenEmoji = () => {
    updateEmojiPosition();
    setOpenEmoji(true);
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

  useEffect(() => {
    if (!openEmoji) return;

    const handle = () => updateEmojiPosition();
    window.addEventListener("resize", handle);
    window.addEventListener("scroll", handle, true); // capture scroll in parent containers

    return () => {
      window.removeEventListener("resize", handle);
      window.removeEventListener("scroll", handle, true);
    };
  }, [openEmoji]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form className="bg-slate-100" onSubmit={onSubmit}>
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
      {openEmoji && (
        <div
          ref={mojRef}
          style={{
            position: "absolute",
            zIndex: 10,
            top: 0,
            left: 0,
            transform: `translate(${emojiPosition.x}px, ${emojiPosition.y}px)`,
          }}
        >
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}

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
          {/* <span onClick={() => setOpenEmoji(true)}> */}
          <span onClick={handleOpenEmoji}>
            <Smile size={20} />
          </span>
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
