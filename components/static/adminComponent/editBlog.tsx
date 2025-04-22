"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "next/image";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import DeleteBlogModal from "./DeleteBlogModal";

// interface MenuButtonProps {
//   onClick: () => void;
//   active?: boolean;
//   children: React.ReactNode;
// }

// const MenuButton: React.FC<MenuButtonProps> = ({
//   onClick,
//   active,
//   children,
// }) => (
//   <button
//     onClick={onClick}
//     className={`p-2 rounded ${
//       active ? "bg-[#a37462] text-white" : "hover:bg-[#e5d8d0]"
//     }`}
//   >
//     {children}
//   </button>
// );

interface BlogPost {
  _id: string;
  title: string;
  description: string;
  content: string;
  seoTitle: string;
  image: string;
  tags: string[];
  userId: {
    username: string;
  };
  readTime: number;
  createdAt: string;
}

export default function EditBlog() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    content: "",
    seoTitle: "",
    image: "",
    tags: [] as string[],
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  const handleDeleteClick = (blogId: string) => {
    setBlogToDelete(blogId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (blogToDelete) {
      handleDelete(blogToDelete);
    }
    setIsDeleteModalOpen(false);
    setBlogToDelete(null);
  };
  const MenuButton = ({
    onClick,
    active,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded-md transition-colors ${
        active ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 text-gray-600"
      }`}
    >
      {children}
    </button>
  );
  const ColorPickerDropdown = ({
    isOpen,
    onClose,
    onColorSelect,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onColorSelect: (color: string) => void;
  }) => {
    const colors = [
      "#000000",
      "#434343",
      "#666666",
      "#999999",
      "#b7b7b7",
      "#cccccc",
      "#d9d9d9",
      "#efefef",
      "#f3f3f3",
      "#ffffff",
      "#980000",
      "#ff0000",
      "#ff9900",
      "#ffff00",
      "#00ff00",
      "#00ffff",
      "#4a86e8",
      "#0000ff",
      "#9900ff",
      "#ff00ff",
    ];

    if (!isOpen) return null;

    return (
      <div className="absolute mt-2 p-2 bg-white rounded-lg shadow-xl border z-50 w-48">
        <div className="grid grid-cols-10 gap-1">
          {colors.map((color) => (
            <button
              key={color}
              className="w-6 h-6 rounded-sm border border-gray-200 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              onClick={() => {
                onColorSelect(color);
                onClose();
              }}
            />
          ))}
        </div>
      </div>
    );
  };
  useEffect(() => {
    fetchBlogs();
  }, []);

  const setLink = () => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor?.chain().focus().unsetLink().run();
      return;
    }
    editor?.chain().focus().setLink({ href: url }).run();
  };
  const fetchBlogs = async () => {
    const response = await fetch("/api/blog");
    const data = await response.json();
    setBlogs(data.blogs);
  };

  const handleEdit = (blog: BlogPost) => {
    setSelectedBlog(blog);
    setEditForm({
      title: blog.title,
      description: blog.description,
      content: blog.content,
      seoTitle: blog.seoTitle,
      image: blog.image,
      tags: blog.tags,
    });
  };
  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          paragraph: { HTMLAttributes: { dir: "auto" } },
          bulletList: false,
          orderedList: false,
        }),
        BulletList.configure({
          keepMarks: true,
          HTMLAttributes: { class: "list-disc ml-4" },
        }),
        OrderedList.configure({
          keepMarks: true,
          HTMLAttributes: { class: "list-decimal ml-4" },
        }),
        TextStyle,
        Color,
        Highlight.configure({ multicolor: true }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: "text-blue-500 underline hover:text-blue-700",
          },
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
          alignments: ["left", "center", "right"],
          defaultAlignment: "left",
        }),
      ],
      content: selectedBlog?.content, // This sets the initial content
      editorProps: {
        attributes: {
          class:
            "prose prose-lg max-w-none focus:outline-none min-h-[200px] rtl",
        },
      },
    },
    [selectedBlog]
  );
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/blog/id`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          id: selectedBlog?._id || "",
        },
        body: JSON.stringify({
          ...editForm,
          content: editor?.getHTML(),
        }),
      });

      if (response.ok) {
        toast.success("بلاگ با موفقیت ویرایش شد");
        setSelectedBlog(null);
        fetchBlogs();
      }
    } catch (error) {
      console.log(error);

      toast.error("خطا در ویرایش بلاگ");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/blog/id`, {
        method: "DELETE",
        headers: {
          id: id,
        },
      });

      if (response.ok) {
        toast.success("بلاگ با موفقیت حذف شد");
        fetchBlogs();
      }
    } catch (error) {
      console.log(error);
      toast.error("خطا در حذف بلاگ");
    }
  };
  useEffect(() => {
    if (editor && selectedBlog) {
      editor.commands.setContent(selectedBlog.content);
    }
  }, [selectedBlog, editor]);
  return (
    <div className="min-h-screen p-6" dir="rtl">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      />

      <h1 className="text-3xl font-bold text-stone-50 my-6">مدیریت بلاگ‌ها</h1>

      {selectedBlog ? (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg"
          onSubmit={handleUpdate}
        >
          <div className="space-y-4">
            <input
              type="text"
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
              placeholder="عنوان"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              value={editForm.seoTitle}
              onChange={(e) =>
                setEditForm({ ...editForm, seoTitle: e.target.value })
              }
              placeholder="عنوان سئو"
              className="w-full p-2 border rounded"
            />
            <textarea
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              placeholder="توضیحات"
              className="w-full p-2 border rounded h-24"
            />
          </div>
          <div>
            <label className="block text-2xl font-bold text-[#fff] text-center my-6">
              محتوای بلاگ
            </label>
            <div className="border border-[#e5d8d0] rounded-2xl overflow-hidden shadow-lg">
              <div className="bg-[#e5d8d0]/30 p-4 border-b border-[#e5d8d0] flex flex-wrap gap-3">
                <MenuButton
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  active={editor?.isActive("bold")}
                >
                  <i className="fas fa-bold"></i>
                </MenuButton>

                <MenuButton
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  active={editor?.isActive("italic")}
                >
                  <i className="fas fa-italic"></i>
                </MenuButton>

                <MenuButton onClick={setLink} active={editor?.isActive("link")}>
                  <i className="fas fa-link"></i>
                </MenuButton>

                <MenuButton
                  onClick={() => editor?.chain().focus().unsetLink().run()}
                  active={false}
                >
                  <i className="fas fa-unlink"></i>
                </MenuButton>

                {[2, 3, 4, 5].map((level) => (
                  <MenuButton
                    key={level}
                    onClick={() =>
                      editor
                        ?.chain()
                        .focus()
                        .toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 })
                        .run()
                    }
                    active={editor?.isActive("heading", { level })}
                  >
                    H{level}
                  </MenuButton>
                ))}

                <div className="relative">
                  <MenuButton
                    onClick={() => setShowTextColorPicker(!showTextColorPicker)}
                    active={showTextColorPicker}
                  >
                    <i className="fas fa-font"></i>
                  </MenuButton>
                  <ColorPickerDropdown
                    isOpen={showTextColorPicker}
                    onClose={() => setShowTextColorPicker(false)}
                    onColorSelect={(color) =>
                      editor?.chain().focus().setColor(color).run()
                    }
                  />
                </div>

                <div className="relative">
                  <MenuButton
                    onClick={() => setShowBgColorPicker(!showBgColorPicker)}
                    active={showBgColorPicker}
                  >
                    <i className="fas fa-fill-drip"></i>
                  </MenuButton>
                  <ColorPickerDropdown
                    isOpen={showBgColorPicker}
                    onClose={() => setShowBgColorPicker(false)}
                    onColorSelect={(color) =>
                      editor?.chain().focus().setHighlight({ color }).run()
                    }
                  />
                </div>

                <MenuButton
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("left").run()
                  }
                  active={editor?.isActive({ textAlign: "left" })}
                >
                  <i className="fas fa-align-left"></i>
                </MenuButton>

                <MenuButton
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("center").run()
                  }
                  active={editor?.isActive({ textAlign: "center" })}
                >
                  <i className="fas fa-align-center"></i>
                </MenuButton>

                <MenuButton
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("right").run()
                  }
                  active={editor?.isActive({ textAlign: "right" })}
                >
                  <i className="fas fa-align-right"></i>
                </MenuButton>

                <MenuButton
                  onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                  }
                  active={editor?.isActive("bulletList")}
                >
                  <i className="fas fa-list-ul"></i>
                </MenuButton>

                <MenuButton
                  onClick={() =>
                    editor?.chain().focus().toggleOrderedList().run()
                  }
                  active={editor?.isActive("orderedList")}
                >
                  <i className="fas fa-list-ol"></i>
                </MenuButton>
              </div>

              <div className="p-6 text-black bg-white/90">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-end justify-end flex-row-reverse gap-4">
            <button
              type="submit"
              className="bg-blue-400 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              ذخیره تغییرات
            </button>
            <button
              type="button"
              onClick={() => setSelectedBlog(null)}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              انصراف
            </button>
          </div>
        </motion.form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="relative h-48">
                <Image
                  src={blog.image || "/assets/images/fade3.jpg"}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold text-[#000] mb-2">
                  {blog.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {blog.description}
                </p>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleEdit(blog)}
                    aria-label="Edit"
                    className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    ویرایش
                  </button>
                  <>
                    <button
                      onClick={() => handleDeleteClick(blog._id)}
                      aria-label="Delete"
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      حذف
                    </button>

                    <DeleteBlogModal
                      isOpen={isDeleteModalOpen}
                      onClose={() => setIsDeleteModalOpen(false)}
                      onConfirm={handleConfirmDelete}
                    />
                  </>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
