import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminProducts() {
  const { data: products = [], refetch } = trpc.products.list.useQuery();
  const createMutation = trpc.products.create.useMutation();
  const deleteMutation = trpc.products.delete.useMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    sku: "",
  });

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync({
        name: formData.name,
        description: formData.description,
        price: formData.price,
        stock: formData.stock,
        sku: formData.sku,
      });
      toast.success("Produto adicionado com sucesso!");
      setFormData({ name: "", description: "", price: 0, stock: 0, sku: "" });
      setIsOpen(false);
      refetch();
    } catch (error) {
      toast.error("Erro ao adicionar produto");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Produto deletado com sucesso!");
        refetch();
      } catch (error) {
        toast.error("Erro ao deletar produto");
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price / 100);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Gerenciar Produtos</h1>
            <p className="text-slate-600 mt-1">Camisetas e outros itens à venda</p>
          </div>
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Produto
          </Button>
        </div>

        {/* Dialog for adding product */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Produto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Produto</Label>
                <Input
                  id="name"
                  placeholder="Ex: Camiseta Igreja"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Preço (em centavos)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="2999 = R$ 29,99"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Estoque</Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="Quantidade"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  placeholder="Código do produto"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descrição do produto"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={createMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {createMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Products List */}
        <div className="grid gap-4">
          {products.length === 0 ? (
            <Card className="p-8 text-center border-0 bg-white">
              <p className="text-slate-600">Nenhum produto adicionado ainda</p>
            </Card>
          ) : (
            products.map((product) => (
              <Card
                key={product.id}
                className="p-4 hover:shadow-lg transition-shadow border-0 bg-white"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
                    <p className="text-lg font-semibold text-green-600 mt-1">
                      {formatPrice(product.price)}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      Estoque: {product.stock} | SKU: {product.sku || "-"}
                    </p>
                    {product.description && (
                      <p className="text-sm text-slate-600 mt-2">{product.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
