import { useEffect, useState } from "react";
import { api, uploadImage } from "../lib/api";
import { Eye, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("Mobiles");
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);

  const fetchProducts = async () => {
    const { data, error } = await api.from("products").select("*");
    if (!error) setProducts(data);
    else toast.error(error.message);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();

    let imageUrl = "";

    if (imageFile) {
      try { imageUrl = (await uploadImage(imageFile)).url; }
      catch (error) { toast.error(error.message); return; }
    }

    if (editingId) {
      const { error } = await api
        .from("products")
        .update({
          name,
          price: Number(price),
          stock: Number(stock),
          category,
          image: imageUrl || products.find((p) => p.id === editingId)?.image,
        })
        .eq("id", editingId);

      if (!error) {
        toast.success("Product updated successfully");
        setEditingId(null);
        setName("");
        setPrice("");
        setStock("");
        setCategory("Mobiles");
        setImageFile(null);
        setShowForm(false);
        fetchProducts();
      } else { toast.error(error.message); }
    } else {
      const { error } = await api.from("products").insert([
        {
          name,
          price: Number(price),
          stock: Number(stock),
          category,
          image: imageUrl,
        },
      ]);

      if (!error) {
        toast.success("Product added successfully");
        setName("");
        setPrice("");
        setStock("");
        setCategory("Mobiles");
        setImageFile(null);
        setShowForm(false);
        fetchProducts();
      } else { toast.error(error.message); }
    }
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );
    if (!confirmDelete) return;

    const { error } = await api.from("products").delete().eq("id", id);
    if (!error) {
      toast.success("Product deleted");
      fetchProducts();
    } else { toast.error(error.message); }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
        <h2 className="text-lg md:text-xl font-semibold">Products</h2>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
        >
          Add Product
        </button>
      </div>

      <div className="hidden md:block overflow-x-auto bg-gray-800 rounded-lg shadow w-full">
        <table className="w-full text-left">
          <thead className="bg-gray-700 text-gray-300 text-xs md:text-sm uppercase">
            <tr>
              <th className="px-3 md:px-6 py-3">Image</th>
              <th className="px-3 md:px-6 py-3">Name</th>
              <th className="px-3 md:px-6 py-3">Price</th>
              <th className="px-3 md:px-6 py-3">Stock</th>
              <th className="px-3 md:px-6 py-3">Category</th>
              <th className="px-3 md:px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-gray-700 hover:bg-gray-700 transition"
              >
                <td className="px-3 md:px-6 py-4">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 md:w-12 md:h-12 object-cover rounded"
                    />
                  )}
                </td>

                <td className="px-3 md:px-6 py-4">{product.name}</td>
                <td className="px-3 md:px-6 py-4">${product.price}</td>
                <td className="px-3 md:px-6 py-4">{product.stock}</td>
                <td className="px-3 md:px-6 py-4">{product.category}</td>

                <td className="px-3 md:px-6 py-4 flex gap-2 md:gap-4">
                  <button
                    onClick={() => setViewProduct(product)}
                    className="text-green-400 hover:text-green-300"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() => {
                      setEditingId(product.id);
                      setName(product.name);
                      setPrice(product.price);
                      setStock(product.stock);
                      setCategory(product.category || "Mobiles");
                      setShowForm(true);
                    }}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gray-800 rounded-lg p-4 flex gap-4 items-center"
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
              />
            )}

            <div className="flex-1">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-400">Price: ${product.price}</p>
              <p className="text-sm text-gray-400">Stock: {product.stock}</p>
              <p className="text-sm text-gray-400">
                Category: {product.category}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setViewProduct(product)}
                className="text-green-400"
              >
                <Eye size={18} />
              </button>

              <button
                onClick={() => {
                  setEditingId(product.id);
                  setName(product.name);
                  setPrice(product.price);
                  setStock(product.stock);
                  setCategory(product.category || "Mobiles");
                  setShowForm(true);
                }}
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
        ))}
      </div>

      {showForm && (
        <div
          onClick={() => setShowForm(false)}
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 rounded-xl p-6 w-[90%] sm:w-[420px] shadow-xl"
          >
            <form onSubmit={addProduct} className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-800 p-2 rounded"
              />

              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-gray-800 p-2 rounded"
              />

              <input
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-gray-800 p-2 rounded"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-800 p-2 rounded"
              >
                <option value="Mobiles">Mobiles</option>
                <option value="Laptops">Laptops</option>
                <option value="Accessories">Accessories</option>
                <option value="Tablets">Tablets</option>
              </select>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full bg-gray-800 p-2 rounded"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
              >
                {editingId ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      {viewProduct && (
        <div
          onClick={() => setViewProduct(null)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 w-[90%] max-h-[90vh] overflow-y-auto rounded-2xl p-5 lg:p-10 flex flex-col lg:flex-row gap-10"
          >
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              {viewProduct.image && (
                <img
                  src={viewProduct.image}
                  alt={viewProduct.name}
                  className="max-h-full max-w-full object-contain rounded-xl"
                />
              )}
            </div>

            <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-6">
              <h2 className="text-xl lg:text-3xl font-bold">
                {viewProduct.name}
              </h2>

              <p className="text-lg text-gray-300">
                Price: ${viewProduct.price}
              </p>

              <p className="text-lg text-gray-300">
                Stock: {viewProduct.stock}
              </p>

              <p className="text-lg text-gray-300">
                Category: {viewProduct.category}
              </p>

              <button
                onClick={() => setViewProduct(null)}
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg w-fit"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
