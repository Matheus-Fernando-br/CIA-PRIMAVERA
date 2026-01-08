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

export default function AdminEvents() {
  const { data: events = [], refetch } = trpc.events.list.useQuery();
  const createMutation = trpc.events.create.useMutation();
  const deleteMutation = trpc.events.delete.useMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventType: "service" as const,
    startDate: "",
    location: "",
    capacity: 0,
  });

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        eventType: formData.eventType,
        startDate: new Date(formData.startDate),
        location: formData.location,
        capacity: formData.capacity || undefined,
      });
      toast.success("Evento adicionado com sucesso!");
      setFormData({
        title: "",
        description: "",
        eventType: "service",
        startDate: "",
        location: "",
        capacity: 0,
      });
      setIsOpen(false);
      refetch();
    } catch (error) {
      toast.error("Erro ao adicionar evento");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este evento?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Evento deletado com sucesso!");
        refetch();
      } catch (error) {
        toast.error("Erro ao deletar evento");
      }
    }
  };

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      retreat: "Retiro",
      service: "Culto",
      meeting: "Reunião",
      special: "Especial",
    };
    return labels[type] || type;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Gerenciar Eventos</h1>
            <p className="text-slate-600 mt-1">Retiros, cultos e reuniões</p>
          </div>
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Evento
          </Button>
        </div>

        {/* Dialog for adding event */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Evento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título do Evento</Label>
                <Input
                  id="title"
                  placeholder="Ex: Retiro Espiritual"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eventType">Tipo de Evento</Label>
                  <select
                    id="eventType"
                    value={formData.eventType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        eventType: e.target.value as any,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="service">Culto</option>
                    <option value="retreat">Retiro</option>
                    <option value="meeting">Reunião</option>
                    <option value="special">Especial</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="startDate">Data e Hora</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Local</Label>
                  <Input
                    id="location"
                    placeholder="Endereço do evento"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacidade</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="Número de pessoas"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descrição do evento"
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
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {createMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Events List */}
        <div className="grid gap-4">
          {events.length === 0 ? (
            <Card className="p-8 text-center border-0 bg-white">
              <p className="text-slate-600">Nenhum evento agendado</p>
            </Card>
          ) : (
            events.map((event) => (
              <Card
                key={event.id}
                className="p-4 hover:shadow-lg transition-shadow border-0 bg-white"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-slate-900">{event.title}</h3>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                        {getEventTypeLabel(event.eventType)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">
                      📅 {new Date(event.startDate).toLocaleDateString("pt-BR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {event.location && (
                      <p className="text-sm text-slate-600 mt-1">📍 {event.location}</p>
                    )}
                    {event.capacity && (
                      <p className="text-sm text-slate-600 mt-1">👥 Capacidade: {event.capacity}</p>
                    )}
                    {event.description && (
                      <p className="text-sm text-slate-600 mt-2">{event.description}</p>
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
                      onClick={() => handleDelete(event.id)}
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
