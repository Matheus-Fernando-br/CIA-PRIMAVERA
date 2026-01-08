import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminSettings() {
  const [channelId, setChannelId] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const syncMutation = trpc.youtube.sync.useMutation();
  const statusQuery = trpc.youtube.status.useQuery();

  const handleSync = async () => {
    if (!channelId.trim()) {
      toast.error("Por favor, insira o ID do canal do YouTube");
      return;
    }

    setIsSyncing(true);
    try {
      const result = await syncMutation.mutateAsync({
        channelId,
        maxResults: 20,
      });
      toast.success(result.message);
    } catch (error) {
      toast.error("Erro ao sincronizar vídeos do YouTube");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Configurações</h1>
          <p className="text-slate-600 mt-1">Gerencie as configurações do site</p>
        </div>

        {/* YouTube Integration */}
        <Card className="p-6 border-0 bg-white">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Integração YouTube</h2>

              {/* Status */}
              <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-start gap-3">
                  {statusQuery.data?.configured ? (
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-700">✓ YouTube API Configurada</p>
                      <p className="text-sm text-green-600 mt-1">
                        A API do YouTube está configurada e pronta para sincronizar vídeos.
                      </p>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                        <p className="text-sm font-semibold text-orange-700">YouTube API não configurada</p>
                      </div>
                      <p className="text-sm text-orange-600">
                        Para usar a sincronização automática, configure a variável de ambiente YOUTUBE_API_KEY.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Channel ID Input */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="channelId">ID do Canal YouTube</Label>
                  <Input
                    id="channelId"
                    placeholder="Ex: UCxxxxxxxxxxxxxxxxxx"
                    value={channelId}
                    onChange={(e) => setChannelId(e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Encontre o ID do seu canal em: youtube.com/account_advanced
                  </p>
                </div>

                <Button
                  onClick={handleSync}
                  disabled={isSyncing || syncMutation.isPending || !statusQuery.data?.configured}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                  {isSyncing ? "Sincronizando..." : "Sincronizar Agora"}
                </Button>

                {!statusQuery.data?.configured && (
                  <p className="text-sm text-orange-600">
                    Configure a YouTube API Key para habilitar a sincronização.
                  </p>
                )}
              </div>

              {/* Instructions */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3">Como configurar a YouTube API:</h3>
                <ol className="space-y-2 text-sm text-blue-800">
                  <li>1. Acesse <a href="https://console.cloud.google.com" className="underline" target="_blank">Google Cloud Console</a></li>
                  <li>2. Crie um novo projeto</li>
                  <li>3. Ative a YouTube Data API v3</li>
                  <li>4. Crie uma chave de API</li>
                  <li>5. Configure a variável de ambiente YOUTUBE_API_KEY com sua chave</li>
                </ol>
              </div>
            </div>
          </div>
        </Card>

        {/* General Settings */}
        <Card className="p-6 border-0 bg-white">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Configurações Gerais</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="siteName">Nome do Site</Label>
              <Input
                id="siteName"
                placeholder="Nossa Igreja"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="siteDescription">Descrição</Label>
              <Input
                id="siteDescription"
                placeholder="Uma comunidade de fé..."
                className="mt-2"
              />
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Salvar Configurações
            </Button>
          </div>
        </Card>

        {/* Contact Settings */}
        <Card className="p-6 border-0 bg-white">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Informações de Contato</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contato@igreja.com"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                placeholder="(XX) XXXX-XXXX"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                placeholder="Rua, número, cidade"
                className="mt-2"
              />
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Salvar Contato
            </Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
