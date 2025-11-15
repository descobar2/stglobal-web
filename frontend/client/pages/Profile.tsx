import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Edit2, LogOut, Home, Search } from "lucide-react";
import { format } from "date-fns";

interface UserProfile {
  name: string;
  email: string;
  displayName?: string;
  workEmail?: string;
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  spokenLanguages?: string;
  officeAddress?: string;
  allergies?: string;
  neurodiversity?: string;
  picture?: string;
}

interface SessionUser extends UserProfile {
  id: number;
}

interface Consultation {
  id?: number | string;
  start: string;
  end: string;
  duration: number;
  status?: "pending" | "confirmed" | "completed";
}

interface PendingConsultation {
  start: string;
  end: string;
  duration: number;
}

interface Document {
  id: string;
  name: string;
  type: string;
}

interface IdentityDocument {
  id: string;
  name: string;
  icon: string;
  editable?: boolean;
}

const PENDING_KEY = "stglobal_consult_pending";
const RESCHEDULE_KEY = "stglobal_consult_reschedule";

const DOCUMENTS: Document[] = [
  { id: "1", name: "Consulting", type: "document" },
  { id: "2", name: "Service Level", type: "document" },
  { id: "3", name: "Confidentiality Agreement.pdf", type: "document" },
  { id: "4", name: "Project Proposal", type: "document" },
];

const IDENTITIES: IdentityDocument[] = [
  { id: "1", name: "Driver's", icon: "🚗" },
  { id: "2", name: "Passport", icon: "📕" },
  { id: "3", name: "Work Visa", icon: "🏠" },
];

const EMPTY_PROFILE: UserProfile = {
  name: "",
  email: "",
  displayName: "",
  workEmail: "",
  phone: "",
  dateOfBirth: "",
  nationality: "",
  spokenLanguages: "",
  officeAddress: "",
  allergies: "",
  neurodiversity: "",
  picture: "",
};

const SAMPLE_HISTORY: Consultation[] = (() => {
  const now = new Date();
  const makeEntry = (offsetDays: number, duration: number): Consultation => {
    const start = new Date(now.getTime() - offsetDays * 24 * 60 * 60 * 1000);
    start.setHours(10, 0, 0, 0);
    const end = new Date(start.getTime() + duration * 60 * 1000);
    return { id: `sample-${offsetDays}`, start: start.toISOString(), end: end.toISOString(), duration, status: "completed" };
  };
  return [makeEntry(10, 60), makeEntry(20, 45)];
})();

function readJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function mapUserProfile(user?: SessionUser | null): UserProfile {
  if (!user) return { ...EMPTY_PROFILE };
  return {
    ...EMPTY_PROFILE,
    ...user,
    displayName: user.displayName ?? user.name,
    workEmail: user.workEmail ?? user.email,
  };
}

function formatRange(startISO: string, endISO: string) {
  return `${format(new Date(startISO), "PPP")} · ${format(new Date(startISO), "hh:mm a")} - ${format(new Date(endISO), "hh:mm a")}`;
}

export default function Profile() {
  const navigate = useNavigate();
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [profile, setProfile] = useState<UserProfile>({ ...EMPTY_PROFILE });
  const [formData, setFormData] = useState<UserProfile>({ ...EMPTY_PROFILE });
  const [isEditing, setIsEditing] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [pendingConsult, setPendingConsult] = useState<PendingConsultation | null>(() => (typeof window === "undefined" ? null : readJSON(PENDING_KEY)));
  const [scheduledConsults, setScheduledConsults] = useState<Consultation[]>([]);
  const [historyConsults, setHistoryConsults] = useState<Consultation[]>([]);
  const [loadingConsultations, setLoadingConsultations] = useState(true);
  const [confirmingConsult, setConfirmingConsult] = useState(false);

  const syncPending = useCallback(() => {
    setPendingConsult(readJSON<PendingConsultation>(PENDING_KEY));
  }, []);

  const fetchConsultations = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/consultations`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("No autorizado");
      const data = await res.json();
      setScheduledConsults(data.scheduled ?? []);
      setHistoryConsults(data.history?.length ? data.history : SAMPLE_HISTORY);
    } catch (err) {
      console.error("No se pudieron cargar las consultorías", err);
      setScheduledConsults([]);
      setHistoryConsults(SAMPLE_HISTORY);
    } finally {
      setLoadingConsultations(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    async function loadProfile() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, { credentials: "include" });
        if (!res.ok) throw new Error("No autorizado");
        const data = await res.json();
        if (!active) return;
        const mapped = mapUserProfile(data.user);
        setSessionUser(data.user);
        setProfile(mapped);
        setFormData(mapped);
      } catch (err) {
        console.error("No se pudo cargar el perfil", err);
        navigate("/login");
      } finally {
        if (active) setLoadingProfile(false);
      }
    }
    loadProfile();
    return () => {
      active = false;
    };
  }, [navigate]);

  useEffect(() => {
    syncPending();
    fetchConsultations();
    window.addEventListener("consultation-pending", syncPending);
    window.addEventListener("consultations-updated", fetchConsultations);
    return () => {
      window.removeEventListener("consultation-pending", syncPending);
      window.removeEventListener("consultations-updated", fetchConsultations);
    };
  }, [fetchConsultations, syncPending]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelEdit = useCallback(() => {
    setFormData(profile);
    setIsEditing(false);
  }, [profile]);

  const handleProfileSave = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Error al actualizar perfil");
      const data = await res.json();
      const mapped = mapUserProfile(data.user);
      setProfile(mapped);
      setFormData(mapped);
      if (data.user) setSessionUser(data.user);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar el perfil");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, { method: "POST", credentials: "include" });
      window.dispatchEvent(new Event("auth-changed"));
      localStorage.removeItem(PENDING_KEY);
      localStorage.removeItem(RESCHEDULE_KEY);
      window.dispatchEvent(new Event("consultation-pending"));
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Error al cerrar sesión");
    }
  };

  const confirmConsultation = useCallback(async () => {
    if (!pendingConsult) return;
    setConfirmingConsult(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/consultations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(pendingConsult),
      });
      if (!response.ok) throw new Error("No se pudo confirmar la consultoría");
      localStorage.removeItem(PENDING_KEY);
      window.dispatchEvent(new Event("consultation-pending"));
      window.dispatchEvent(new Event("consultations-updated"));
    } catch (err) {
      console.error(err);
      alert("No se pudo confirmar la consultoría");
    } finally {
      setConfirmingConsult(false);
    }
  }, [pendingConsult]);

  const routeToAgenda = useCallback(
    (storedData?: object) => {
      if (storedData) localStorage.setItem(RESCHEDULE_KEY, JSON.stringify(storedData));
      navigate("/agenda");
    },
    [navigate]
  );

  const pendingSection = useMemo(() => {
    if (!pendingConsult) return null;
    return (
      <Card className="mb-6 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold">Confirmar consultoría</h3>
            <p className="text-sm text-muted-foreground">{formatRange(pendingConsult.start, pendingConsult.end)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Duración: {pendingConsult.duration} min · Estado: <span className="text-yellow-600">Pendiente</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => routeToAgenda()}>
              Re-agendar
            </Button>
            <Button size="sm" disabled={confirmingConsult} onClick={confirmConsultation}>
              {confirmingConsult ? "Confirmando…" : "Confirmar"}
            </Button>
          </div>
        </div>
      </Card>
    );
  }, [confirmConsultation, confirmingConsult, pendingConsult, routeToAgenda]);

  const scheduledSection = useMemo(() => {
    if (!scheduledConsults.length) return null;
    return (
      <Card className="mb-6 p-4">
        <h3 className="text-xl font-bold mb-3">Consultorías agendadas</h3>
        <div className="space-y-3">
          {scheduledConsults.map((consult) => (
            <div key={consult.id ?? consult.start} className="flex items-center justify-between rounded-md border px-3 py-2">
              <div>
                <p className="text-sm font-semibold">{formatRange(consult.start, consult.end)}</p>
                <p className="text-xs text-muted-foreground">Duración: {consult.duration} min · Estado: <span className="text-green-600">Confirmada</span></p>
              </div>
              <Button variant="outline" size="sm" onClick={() => routeToAgenda({ id: consult.id })}>
                Re-agendar
              </Button>
            </div>
          ))}
        </div>
      </Card>
    );
  }, [routeToAgenda, scheduledConsults]);

  const historySection = useMemo(() => {
    if (!historyConsults.length) return null;
    return (
      <Card className="mb-6 p-4">
        <h3 className="text-xl font-bold mb-3">Historial de consultorías</h3>
        <div className="space-y-3">
          {historyConsults.map((consult) => (
            <div key={consult.id ?? consult.start} className="flex items-center justify-between rounded-md border px-3 py-2">
              <div>
                <p className="text-sm font-semibold">{formatRange(consult.start, consult.end)}</p>
                <p className="text-xs text-muted-foreground">
                  Duración: {consult.duration} min · Estado: <span className="text-blue-600">Realizada</span>
                </p>
              </div>
              <Button size="sm" onClick={() => alert("Minuta disponible próximamente")}>
                Ver minuta
              </Button>
            </div>
          ))}
        </div>
      </Card>
    );
  }, [historyConsults]);

  if (loadingProfile || loadingConsultations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="hidden md:flex md:fixed md:top-0 md:left-0 md:right-0 bg-background border-b border-border justify-between items-center px-4 py-4">
        <button className="flex flex-col md:flex-row md:gap-2 items-center text-muted-foreground hover:text-foreground">
          <Home className="h-6 w-6 md:h-5 md:w-5" />
          <span className="hidden md:inline text-sm">Home</span>
        </button>
        <button className="flex flex-col md:flex-row md:gap-2 items-center text-muted-foreground hover:text-foreground">
          <Search className="h-6 w-6 md:h-5 md:w-5" />
          <span className="hidden md:inline text-sm">Search</span>
        </button>
        <button className="flex flex-col md:flex-row md:gap-2 items-center text-muted-foreground hover:text-foreground">
          <span className="h-6 w-6 md:h-5 md:w-5 flex items-center justify-center text-lg">+</span>
          <span className="hidden md:inline text-sm">Create</span>
        </button>
        <button className="flex flex-col md:flex-row md:gap-2 items-center text-muted-foreground hover:text-foreground">
          <span className="h-6 w-6 md:h-5 md:w-5 flex items-center justify-center">💬</span>
          <span className="hidden md:inline text-sm">Messages</span>
        </button>
        <button onClick={() => navigate("/profile")} className="flex flex-col md:flex-row md:gap-2 items-center text-primary">
          <span className="h-6 w-6 md:h-5 md:w-5 flex items-center justify-center">👤</span>
          <span className="hidden md:inline text-sm">Profile</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6 pb-16 md:pb-6 md:pt-24">
        {pendingSection}
        {scheduledSection}
        {historySection}

        <Card className="mb-8 p-6">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-2xl font-bold">User Profile</h2>
            <Button variant="outline" size="sm" onClick={() => (isEditing ? setIsEditing(false) : setIsEditing(true))} className="flex gap-2">
              <Edit2 className="h-4 w-4" />
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="displayName" className="text-sm font-medium">
                Display name
              </Label>
              <Input id="displayName" name="displayName" value={isEditing ? formData.displayName : profile.displayName} onChange={handleInputChange} disabled={!isEditing} className="mt-1" />
            </div>

            <div>
              <Label htmlFor="workEmail" className="text-sm font-medium">
                Work email
              </Label>
              <Input id="workEmail" name="workEmail" type="email" value={isEditing ? formData.workEmail : profile.workEmail} onChange={handleInputChange} disabled={!isEditing} className="mt-1" />
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone number
              </Label>
              <Input id="phone" name="phone" value={isEditing ? formData.phone : profile.phone} onChange={handleInputChange} disabled={!isEditing} className="mt-1" />
            </div>

            <div>
              <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                Date of birth
              </Label>
              <Input id="dateOfBirth" name="dateOfBirth" value={isEditing ? formData.dateOfBirth : profile.dateOfBirth} onChange={handleInputChange} disabled={!isEditing} className="mt-1" />
            </div>

            <div>
              <Label htmlFor="nationality" className="text-sm font-medium">
                Nationality
              </Label>
              <Input id="nationality" name="nationality" value={isEditing ? formData.nationality : profile.nationality} onChange={handleInputChange} disabled={!isEditing} className="mt-1" />
            </div>

            <div>
              <Label htmlFor="spokenLanguages" className="text-sm font-medium">
                Spoken languages
              </Label>
              <Input id="spokenLanguages" name="spokenLanguages" value={isEditing ? formData.spokenLanguages : profile.spokenLanguages} onChange={handleInputChange} disabled={!isEditing} className="mt-1" />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="officeAddress" className="text-sm font-medium">
                Office address
              </Label>
              <Input id="officeAddress" name="officeAddress" value={isEditing ? formData.officeAddress : profile.officeAddress} onChange={handleInputChange} disabled={!isEditing} className="mt-1" />
            </div>

            <div>
              <Label htmlFor="allergies" className="text-sm font-medium">
                Allergies
              </Label>
              <Input id="allergies" name="allergies" value={isEditing ? formData.allergies : profile.allergies} onChange={handleInputChange} disabled={!isEditing} className="mt-1" />
            </div>

            <div>
              <Label htmlFor="neurodiversity" className="text-sm font-medium">
                Neurodiversity
              </Label>
              <Input id="neurodiversity" name="neurodiversity" value={isEditing ? formData.neurodiversity : profile.neurodiversity} onChange={handleInputChange} disabled={!isEditing} className="mt-1" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={isEditing ? handleProfileSave : () => setIsEditing(true)}>{isEditing ? "Guardar" : "Editar"}</Button>
            {isEditing && (
              <Button type="button" variant="outline" onClick={handleCancelEdit}>
                Cancelar
              </Button>
            )}
          </div>
        </Card>

        <Card className="mb-8 p-6">
          <h3 className="text-xl font-bold mb-4">Documentos compartidos</h3>
          <div className="space-y-3">
            {DOCUMENTS.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.type}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Descargar
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <div className="hidden md:flex gap-4">
          <Button variant="destructive" onClick={handleLogout} className="flex-1 gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
