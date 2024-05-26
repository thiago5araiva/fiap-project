import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";
import {
  asyncAddHost,
  asyncGetCompanyHosts,
  asyncGetPlatforms,
  IFormAddHost,
  IHosts,
  IPlatform,
  IProfile,
} from "@/services/hosts";
import { Eye, Plus } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function App() {
  const [open, setOpen] = useState(false);
  const [hosts, setHosts] = useState<IHosts[]>();
  const [platforms, setPlatforms] = useState<IPlatform[]>([]);
  const [profile, setProfile] = useState<IProfile[]>([]);

  const [formData, setFormData] = useState<IFormAddHost>({});

  const handleSelectName = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, name: event.currentTarget.value }));
  };

  const handleSelectAddress = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, hostaddr: event.currentTarget.value }));
  };

  const handleSelectCredentials = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      credentials: { ...prev.credentials, user: event.currentTarget.value },
    }));
  };

  const handleSelectPlatform = (value: string) => {
    if (!value) return;
    const platform = platforms.filter((item) => item.platform_id === value);
    setFormData((prev) => ({ ...prev, platform_id: platform[0].platform_id }));
    setProfile(platform[0].profiles);
  };

  const handleSelectProfile = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      profiles: [value],
    }));
  };

  const handleSave = async () => {
    const newHost = {
      ...formData,
      company_id: "test",
      port: 200,
      status: "check-config",
    };
    await asyncAddHost(newHost);
    const { data } = await asyncGetCompanyHosts();
    setHosts(data);
    setOpen(false);
  };

  useEffect(() => {
    const hosts = async () => {
      const { data } = await asyncGetCompanyHosts();
      setHosts(data);
    };
    hosts();
  }, []);

  useEffect(() => {
    const platforms = async () => {
      const { data } = await asyncGetPlatforms();
      setPlatforms(data);
    };
    platforms();
  }, []);

  return (
    <section className="home">
      <div className="grid gap-10">
        <div className="header flex justify-end mt-10">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="text-background mr-3 w-4 h-4" />
                Novo Host
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar novo Host</DialogTitle>
                <DialogDescription>Adicione aqui o novo host</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    defaultValue=""
                    className="col-span-3"
                    onChange={handleSelectName}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Endereço
                  </Label>
                  <Input
                    id="username"
                    defaultValue=""
                    className="col-span-3"
                    onChange={handleSelectAddress}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="credentials" className="text-right">
                    Credenciais
                  </Label>
                  <Input
                    id="credentials"
                    defaultValue=""
                    className="col-span-3"
                    onChange={handleSelectCredentials}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="platforms" className="text-right">
                    Plataformas
                  </Label>
                  <Select onValueChange={handleSelectPlatform}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione a plataforma" />
                    </SelectTrigger>
                    <SelectContent id="platforms">
                      <SelectGroup>
                        <SelectLabel>Plataformas</SelectLabel>
                        {platforms
                          ?.map((item) => ({
                            id: item.platform_id,
                            label: item.title,
                          }))
                          .map((item) => (
                            <SelectItem value={item.id} key={item.id}>
                              {item.label}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="profiles" className="text-right">
                    Profiles
                  </Label>
                  <Select onValueChange={handleSelectProfile}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o profile" />
                    </SelectTrigger>
                    <SelectContent id="profiles">
                      <SelectGroup>
                        <SelectLabel>Profiles</SelectLabel>
                        {profile.map((item) => (
                          <SelectItem value={item.id} key={item.id}>
                            {item.title}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button className="w-full" onClick={handleSave}>
                  Salvar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Credencial</TableHead>
                <TableHead>Plataforma</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Visualizar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hosts?.map((scan, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{scan.host_id}</TableCell>
                  <TableCell className="font-medium">{scan.name}</TableCell>
                  <TableCell>{scan.hostaddr}</TableCell>
                  <TableCell>{scan.credentials.type}</TableCell>
                  <TableCell>{scan.platform_id}</TableCell>
                  <TableCell>{scan.status}</TableCell>
                  <TableCell>
                    <Link
                      className="flex justify-end"
                      to={`/scans/${scan.host_id}`}
                    >
                      <Eye className="text-primary" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
