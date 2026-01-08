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

export default function AdminSermons() {
  const { data: sermons = [], refetch } = trpc.sermons.list.useQuery();
  const createMutation = trpc.sermons.create.useMutation();
  const deleteMutation = trpc.sermons.delete.useMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtubeVideoId: "",
    speaker: "",
  });

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        youtubeVideoId: formData.youtubeVideoId,
        speaker: formData.speaker,
      });
      toast.success("Pregação adicionada com sucesso!");
      setFormData({ title: "", description: "", youtubeVideoId: "", speaker: "" });
      setIsOpen(false);
      refetch();
    } catch (error) {
      toast.error("Erro ao adicionar pregação");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar esta pregação?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Pregação deletada com sucesso!");
        refetch();
      } catch (error) {
        toast.error("Erro ao deletar pregação");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Gerenciar Pregações</h1>
            <p className="text-slate-600 mt-1">Adicione e edite pregações do YouTube</p>
          </div>
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nova Pregação
          </Button>
        </div>

        {/* Dialog for adding sermon */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Pregação</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  placeholder="Título da pregação"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="speaker">Pregador</Label>
                <Input
                  id="speaker"
                  placeholder="Nome do pregador"
                  value={formData.speaker}
                  onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="youtubeVideoId">ID do Vídeo YouTube</Label>
                <Input
                  id="youtubeVideoId"
                  placeholder="Ex: dQw4w9WgXcQ"
                  value={formData.youtubeVideoId}
                  onChange={(e) => setFormData({ ...formData, youtubeVideoId: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descrição da pregação"
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
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Sermons List */}
        <div className="grid gap-4">
          {sermons.length === 0 ? (
            <Card className="p-8 text-center border-0 bg-white">
              <p className="text-slate-600">Nenhuma pregação adicionada ainda</p>
            </Card>
          ) : (
            sermons.map((sermon) => (
              <Card
                key={sermon.id}
                className="p-4 hover:shadow-lg transition-shadow border-0 bg-white"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900">{sermon.title}</h3>
                    {sermon.speaker && (
                      <p className="text-sm text-slate-600 mt-1">Por {sermon.speaker}</p>
                    )}
                    <p className="text-sm text-slate-500 mt-2">
                      ID YouTube: {sermon.youtubeVideoId}
                    </p>
                    {sermon.description && (
                      <p className="text-sm text-slate-600 mt-2">{sermon.description}</p>
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
                      onClick={() => handleDelete(sermon.id)}
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
