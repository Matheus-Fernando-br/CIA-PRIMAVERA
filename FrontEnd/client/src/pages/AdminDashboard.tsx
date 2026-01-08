import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BookOpen, ShoppingBag, Calendar, FileText } from "lucide-react";

export default function AdminDashboard() {
  const { data: sermons = [] } = trpc.sermons.list.useQuery();
  const { data: products = [] } = trpc.products.list.useQuery();
  const { data: events = [] } = trpc.events.list.useQuery();

  const stats = [
    {
      icon: BookOpen,
      label: "Pregações",
      value: sermons.length,
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: ShoppingBag,
      label: "Produtos",
      value: products.length,
      color: "from-green-500 to-green-600",
    },
    {
      icon: Calendar,
      label: "Eventos",
      value: events.length,
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: FileText,
      label: "Seções",
      value: "0",
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-2">Bem-vindo ao painel administrativo da Igreja</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="p-6 hover:shadow-lg transition-shadow border-0 bg-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Sermons */}
          <Card className="p-6 border-0 bg-white">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Pregações Recentes</h2>
            <div className="space-y-3">
              {sermons.slice(0, 5).map((sermon) => (
                <div
                  key={sermon.id}
                  className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <p className="font-medium text-slate-900">{sermon.title}</p>
                  <p className="text-sm text-slate-600 mt-1">
                    {sermon.speaker && `Por ${sermon.speaker}`}
                  </p>
                </div>
              ))}
              {sermons.length === 0 && (
                <p className="text-slate-500 text-sm">Nenhuma pregação adicionada ainda</p>
              )}
            </div>
          </Card>

          {/* Recent Events */}
          <Card className="p-6 border-0 bg-white">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Próximos Eventos</h2>
            <div className="space-y-3">
              {events.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <p className="font-medium text-slate-900">{event.title}</p>
                  <p className="text-sm text-slate-600 mt-1">
                    {event.startDate && new Date(event.startDate).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              ))}
              {events.length === 0 && (
                <p className="text-slate-500 text-sm">Nenhum evento agendado</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
