import { useEffect, useState } from "react";
import { api, uploadImage } from "../lib/api";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const categories = ["All", "Mobiles", "Laptops", "Accessories", "Tablets"];

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("Mobiles");

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    const { data, error } = await api.from("products").select("*");
    if (!error) setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImage = (file) => {
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const saveProduct = async (e) => {
    e.preventDefault();

    let imageUrl = preview;

    if (imageFile) {
      try { imageUrl = (await uploadImage(imageFile)).url; }
      catch (error) { toast.error(error.message); return; }
    }

    if (editingId) {
      const {error} = await api
        .from("products")
        .update({
          name,
          price: Number(price),
          stock: Number(stock),
          category,
          image: imageUrl,
        })
        .eq("id", editingId);

      if (error) { toast.error(error.message); return; }
      toast.success("Product updated");
    } else {
      const {error} = await api.from("products").insert([
        {
          name,
          price: Number(price),
          stock: Number(stock),
          category,
          image: imageUrl,
        },
      ]);

      if (error) { toast.error(error.message); return; }
      toast.success("Product added");
    }

    resetForm();
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete product?")) return;

    const {error} = await api.from("products").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }

    toast.success("Product deleted");
    fetchProducts();
  };

  const editProduct = (p) => {
    setEditingId(p.id);
    setName(p.name);
    setPrice(p.price);
    setStock(p.stock);
    setCategory(p.category);
    setPreview(p.image);
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setName("");
    setPrice("");
    setStock("");
    setCategory("Mobiles");
    setImageFile(null);
    setPreview("");
  };

  const filteredProducts = products.filter((p) => {
    const matchCategory =
      activeCategory === "All" || p.category === activeCategory;

    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Product Catalog</h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
        >
          Add Product
        </button>
      </div>

      {/* Search */}
      <input
        placeholder="Search product..."
        className="bg-gray-700 p-2 rounded w-full md:w-72"
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Categories */}
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full transition
            ${
              activeCategory === cat
                ? "bg-blue-600 scale-105"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-gray-800 rounded-xl overflow-hidden shadow hover:scale-105 transition"
          >
            {product.image && (
              <img src={product.image} className="w-full h-40 object-cover" />
            )}

            <div className="p-4 space-y-1">
              <h2 className="font-semibold">{product.name}</h2>

              <p className="text-gray-400">${product.price}</p>

              <p className="text-xs text-gray-500">
                Category: {product.category}
              </p>

              <p className="text-xs">Stock: {product.stock}</p>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => editProduct(product)}
                  className="text-blue-400"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() => deleteProduct(product.id)}
                  className="text-red-400"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog */}
      {showForm && (
        <div
          onClick={resetForm}
          className="fixed inset-0 bg-black/60 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 p-6 rounded-xl w-96 space-y-4"
          >
            <h2 className="text-lg font-semibold">
              {editingId ? "Edit Product" : "Add Product"}
            </h2>

            <form onSubmit={saveProduct} className="space-y-3">
              <input
                placeholder="Name"
                className="w-full bg-gray-800 p-2 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="number"
                placeholder="Price"
                className="w-full bg-gray-800 p-2 rounded"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <input
                type="number"
                placeholder="Stock"
                className="w-full bg-gray-800 p-2 rounded"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />

              <select
                className="w-full bg-gray-800 p-2 rounded"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Mobiles</option>
                <option>Laptops</option>
                <option>Accessories</option>
                <option>Tablets</option>
              </select>

              <input
                type="file"
                onChange={(e) => handleImage(e.target.files[0])}
                className="w-full bg-gray-800 p-2 rounded"
              />

              {preview && (
                <img
                  src={preview}
                  className="w-full h-32 object-cover rounded"
                />
              )}

              <button className="w-full bg-blue-600 py-2 rounded">
                {editingId ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
