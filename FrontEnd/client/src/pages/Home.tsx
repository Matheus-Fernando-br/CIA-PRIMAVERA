import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { BookOpen, ShoppingBag, Calendar, Users, ArrowRight, LogIn } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { data: sermons = [] } = trpc.sermons.list.useQuery();
  const { data: products = [] } = trpc.products.list.useQuery();
  const { data: events = [] } = trpc.events.list.useQuery();

  const features = [
    {
      icon: BookOpen,
      title: "Pregações",
      description: "Assista às pregações mais recentes",
      count: sermons.length,
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: ShoppingBag,
      title: "Produtos",
      description: "Camisetas e itens exclusivos",
      count: products.length,
      color: "from-green-500 to-green-600",
    },
    {
      icon: Calendar,
      title: "Eventos",
      description: "Retiros, cultos e reuniões",
      count: events.length,
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Users,
      title: "Comunidade",
      description: "Conecte-se com nossa comunidade",
      count: 0,
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Igreja
          </div>
          <div className="flex gap-4">
            {isAuthenticated && user?.role === "admin" && (
              <Button
                onClick={() => setLocation("/admin")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Painel Admin
              </Button>
            )}
            {!isAuthenticated && (
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Entrar
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900">
                Bem-vindo à Nossa
                <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Comunidade de Fé
                </span>
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Junte-se a nós em uma jornada espiritual transformadora. Pregações, eventos e uma comunidade acolhedora esperando por você.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-lg flex items-center gap-2"
              >
                Comece Agora
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 rounded-lg"
              >
                Saiba Mais
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900">O Que Oferecemos</h2>
            <p className="text-xl text-slate-600 mt-4">Explore nossa comunidade e descubra tudo que temos para você</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-slate-50 to-slate-100 cursor-pointer group"
                >
                  <div className={`bg-gradient-to-br ${feature.color} p-4 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 mt-2">{feature.description}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-4">{feature.count}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Sermons */}
      {sermons.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold text-slate-900">Pregações Recentes</h2>
                <p className="text-slate-600 mt-2">Assista às mensagens mais recentes</p>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                Ver Todas
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sermons.slice(0, 3).map((sermon) => (
                <Card
                  key={sermon.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow border-0 bg-white"
                >
                  {sermon.thumbnailUrl && (
                    <img
                      src={sermon.thumbnailUrl}
                      alt={sermon.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900">{sermon.title}</h3>
                    {sermon.speaker && (
                      <p className="text-sm text-slate-600 mt-1">Por {sermon.speaker}</p>
                    )}
                    {sermon.description && (
                      <p className="text-sm text-slate-600 mt-2 line-clamp-2">{sermon.description}</p>
                    )}
                    <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                      Assistir
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold text-slate-900">Próximos Eventos</h2>
                <p className="text-slate-600 mt-2">Não perca nossos eventos especiais</p>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                Ver Calendário
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.slice(0, 2).map((event) => (
                <Card
                  key={event.id}
                  className="p-6 hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-purple-50 to-blue-50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-900">{event.title}</h3>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                      {event.eventType === "retreat"
                        ? "Retiro"
                        : event.eventType === "service"
                        ? "Culto"
                        : event.eventType === "meeting"
                        ? "Reunião"
                        : "Especial"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    📅 {new Date(event.startDate).toLocaleDateString("pt-BR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  {event.location && (
                    <p className="text-sm text-slate-600 mb-4">📍 {event.location}</p>
                  )}
                  {event.description && (
                    <p className="text-slate-600 mb-4 line-clamp-2">{event.description}</p>
                  )}
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Saiba Mais
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products */}
      {products.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold text-slate-900">Nossa Loja</h2>
                <p className="text-slate-600 mt-2">Produtos exclusivos da nossa comunidade</p>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                Ver Loja
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 3).map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow border-0 bg-white"
                >
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900">{product.name}</h3>
                    <p className="text-lg font-semibold text-green-600 mt-2">
                      R$ {(product.price / 100).toFixed(2)}
                    </p>
                    {product.description && (
                      <p className="text-sm text-slate-600 mt-2 line-clamp-2">{product.description}</p>
                    )}
                    <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                      Comprar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Nossa Igreja</h3>
              <p className="text-slate-400">Uma comunidade de fé dedicada ao crescimento espiritual.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition">Pregações</a></li>
                <li><a href="#" className="hover:text-white transition">Eventos</a></li>
                <li><a href="#" className="hover:text-white transition">Loja</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contato</h3>
              <p className="text-slate-400">
                Email: contato@igreja.com<br />
                Telefone: (XX) XXXX-XXXX
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Redes Sociais</h3>
              <div className="flex gap-4">
                <a href="#" className="text-slate-400 hover:text-white transition">Facebook</a>
                <a href="#" className="text-slate-400 hover:text-white transition">Instagram</a>
                <a href="#" className="text-slate-400 hover:text-white transition">YouTube</a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Nossa Igreja. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
