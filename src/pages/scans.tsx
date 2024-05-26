import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
import {
  IPlatform,
  IProfile,
  IScan,
  asyncGetPlatforms,
  asyncGetScanById,
  asyncPostScanById,
} from "@/services/hosts";
import { Eye, Plus, ScanBarcode } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

/***

- botao pra dar visualizacao na tela de scan quando for complete
- habilitar o botão para novo scan
- permitir que o cara selecione um profile para fazer o novo scan
- botao pra dar scan na tela de scan quando for complete
- default : a442f278-a90d-456c-a4b2-adf28d5c7754
***/

export default function Scans() {
  const [open, setOpen] = useState(false);
  const [scan, setScan] = useState<IScan[]>([]);
  const [platforms, setPlatforms] = useState<IPlatform[]>([]);
  const [profile, setProfile] = useState<IProfile[]>([]);

  const [currentPlatform, setCurrentPlatform] = useState<string>("");
  const [currentProfile, setCurrentProfile] = useState<string>("");
  const { id } = useParams();

  /***
   GET/hosts/{host_id}/profiles
   GET/hosts/{host_id}/scan/list ["tem que vir com o link dos results"]
   POST/hosts/{host_id}/scan

   ***/
  const handleSelectPlatform = (value: string) => {
    setCurrentPlatform(value);
    const platform = platforms.filter((item) => item.platform_id === value);
    setProfile(platform[0].profiles);
  };

  const handleSelectProfile = (value: string) => {
    setCurrentProfile(value);
  };

  const handleSave = async () => {
    if (currentPlatform.length === 0) return;
    if (currentProfile.length === 0) return;

    const values = {
      platform_id: currentPlatform,
      profile_id: currentProfile,
    };
    await asyncPostScanById(id, values);
    const { data } = await asyncGetScanById(id);
    setScan(data);
    setOpen(false);
  };

  useEffect(() => {
    const scan = async () => {
      const { data } = await asyncGetScanById(id);
      setScan(data);
    };
    scan();
  }, [id]);

  useEffect(() => {
    const platforms = async () => {
      const { data } = await asyncGetPlatforms();
      setPlatforms(data);
    };
    platforms();
  }, []);

  return (
    <section className="scan">
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
                <Label htmlFor="platforms" className="text-right">
                  Plataformas
                </Label>
                <Select onValueChange={handleSelectPlatform}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione a plataforma" />
                  </SelectTrigger>
                  <SelectContent id="platforms">
                    <SelectGroup>
                      <SelectLabel>Profiles</SelectLabel>
                      {platforms.map((item) => (
                        <SelectItem
                          value={item.platform_id}
                          key={item.platform_id}
                        >
                          {item.title}
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
      <div className="mt-10">
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Error Message</TableHead>
                <TableHead>Plataforma</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Profile</TableHead>
                <TableHead>Scan</TableHead>
                <TableHead>Host</TableHead>
                <TableHead className="text-center">Re-Scan</TableHead>
                <TableHead className="text-center">Visualizar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scan?.map((scan, index) => (
                <TableRow key={index} className="text-xs">
                  <TableCell className="font-medium text-xs">
                    {scan.error_message}
                  </TableCell>
                  <TableCell className="font-medium">
                    {scan.platform_id}
                  </TableCell>
                  <TableCell>{scan.timestamp}</TableCell>
                  <TableCell>{scan.status}</TableCell>
                  <TableCell>{scan.profile_id}</TableCell>
                  <TableCell>{scan.scan_id}</TableCell>
                  <TableCell>{scan.host_id}</TableCell>
                  <TableCell>
                    <Button
                      className="flex justify-center"
                      variant={"ghost"}
                      disabled={scan.status === "completed" ? false : true}
                    >
                      <ScanBarcode className="text-primary" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={"ghost"}
                      disabled={scan.status === "completed" ? false : true}
                    >
                      <Link
                        className="flex justify-center"
                        to={`/scans/${scan.host_id}`}
                      >
                        <Eye className="text-primary" />
                      </Link>
                    </Button>
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
