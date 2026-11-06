import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, CalendarCheck2, LogIn, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
	{ to: "/", label: "Inicio" },
	{ to: "/servicios", label: "Servicios" },
	{ to: "/experiencia", label: "Experiencia" },
	{ to: "/acerca", label: "Acerca de" },
];

export default function Layout() {
	const [open, setOpen] = useState(false);
	const [sessionUser, setSessionUser] = useState<{ name?: string } | null>(null);
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		let active = true;

		const validateSession = async () => {
			try {
				const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
					credentials: "include",
				});
				if (!res.ok) throw new Error("No session");
				const data = await res.json();
				if (active) setSessionUser(data.user);
			} catch {
				if (active) setSessionUser(null);
			}
		};

		validateSession();

		const handleAuthChanged = () => {
			validateSession();
		};

		window.addEventListener("auth-changed", handleAuthChanged);

		return () => {
			active = false;
			window.removeEventListener("auth-changed", handleAuthChanged);
		};
	}, [location.pathname]);

	async function handleLogout() {
		try {
			await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
				method: "POST",
				credentials: "include",
			});
			window.dispatchEvent(new Event("auth-changed"));
		} catch (err) {
			console.error("No se pudo cerrar sesión", err);
		} finally {
			setSessionUser(null);
			navigate("/");
		}
	}

	return (
		<div className="min-h-screen flex flex-col bg-background text-foreground">
			<header data-loc="nav-global" className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container flex h-16 items-center justify-between">
					<Link to="/" className="flex items-center gap-2">
						<ShieldCheck className="h-6 w-6 text-primary" />
						<span className="font-extrabold tracking-tight">STGlobal</span>
					</Link>
					<nav className="hidden md:flex items-center gap-6">
						{navItems.map((item) => (
							<NavLink
								key={item.to}
								to={item.to}
								className={({ isActive }) =>
									cn(
										"text-sm font-medium transition-colors hover:text-primary",
										isActive ? "text-primary" : "text-muted-foreground",
									)
								}
							>
								{item.label}
							</NavLink>
						))}
					</nav>
					<div className="hidden md:flex items-center gap-4">
						{sessionUser ? (
							<>
								<Button variant="link" className="px-0 text-muted-foreground" onClick={() => navigate("/profile")}>
									Hola, {sessionUser.name?.split(" ")[0] ?? "usuario"}
								</Button>
								<Button asChild variant="ghost">
									<Link to="/agenda" className="inline-flex items-center gap-2 bg-primary text-white rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap">
										<CalendarCheck2 className="w-4 h-4 text-white" />
										Agendar consultoría
									</Link>
								</Button>
								<Button
									variant="destructive"
									onClick={handleLogout}
									className="rounded-md shadow px-3 py-2 gap-2 text-sm font-medium text-white inline-flex items-center"
									aria-label="Cerrar sesión"
								>
									<LogOut className="w-4 h-4" />
									Logout
								</Button>
							</>
						) : (
							<>
								<Button asChild variant="ghost">
									<Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary whitespace-nowrap">
										<LogIn className="w-4 h-4" />
										Iniciar sesión
									</Link>
								</Button>
								<Button asChild variant="ghost">
									<Link to="/agenda" className="inline-flex items-center gap-2 bg-primary text-white rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap">
										<CalendarCheck2 className="w-4 h-4 text-white" />
										Agendar consultoría
									</Link>
								</Button>
							</>
						)}
					</div>
					<div className="md:hidden flex items-center gap-3">
						<a
							href="/agenda"
							className="inline-flex items-center gap-2 bg-primary text-white rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap"
						>
							<CalendarCheck2 className="w-4 h-4 text-white" />
							Agendar
						</a>
						{sessionUser && (
							<button
								onClick={handleLogout}
								className="inline-flex items-center justify-center rounded-md bg-destructive text-white h-9 w-9 shadow aspect-square"
								aria-label="Cerrar sesión"
							>
								<LogOut className="w-4 h-4" />
							</button>
						)}
						<button
							className="inline-flex items-center justify-center rounded-md p-2 hover:bg-accent"
							onClick={() => setOpen((v) => !v)}
							aria-label="Toggle menu"
						>
							{open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
						</button>
					</div>
				</div>
				{open && (
					<div className="md:hidden border-t">
						<div className="container py-3 flex flex-col gap-2">
							{navItems.map((item) => (
								<NavLink
									key={item.to}
									to={item.to}
									onClick={() => setOpen(false)}
									className={({ isActive }) =>
										cn(
											"py-2 text-sm font-medium hover:text-primary",
											isActive ? "text-primary" : "text-muted-foreground",
										)
									}
								>
									{item.label}
								</NavLink>
							))}
							<div className="flex gap-2">
								<Button asChild variant="ghost" size="sm" className="flex-1">
									<Link to="/login" onClick={() => setOpen(false)}>
										<LogIn className="mr-2" /> Iniciar sesión
									</Link>
								</Button>
							</div>
						</div>
					</div>
				)}
			</header>

			<main className="flex-1">
				{/* Route-aware banner */}
				{(() => {
					const titles: Record<string, string> = {
						"/": "Inicio",
						"/servicios": "Servicios",
						"/experiencia": "Experiencia",
						"/acerca": "Acerca de",
						"/contacto": "Contacto",
						"/agenda": "Agenda",
						"/admin": "Panel administrativo",
					};
					const title = titles[location.pathname];
					return title ? (
						<section className="border-b bg-background/50" />
					) : null;
				})()}

				<Outlet />
			</main>

			<footer className="border-t bg-muted/20">
        <div className="container py-10 grid gap-6 md:grid-cols-3">
          <div>
						<p className="font-semibold">Consultora en ciberseguridad</p>
            <p className="mt-2 text-sm text-muted-foreground">
							Buenas prácticas, gestión de riesgos y vulnerabilidades en on‑prem y nube.
						</p>
					</div>
					<div>
						<div className="flex items-center gap-2">
							<ShieldCheck className="h-5 w-5 text-primary" />
							<span className="font-semibold">STGlobal</span>
						</div>
            <p className="mt-2 text-sm text-muted-foreground">
              © {new Date().getFullYear()} STGlobal. Todos los derechos reservados.
            </p>
					</div>
					<div>
						<p className="font-semibold">Síguenos</p>
						<div className="mt-3 flex gap-2">
							<a
							href="https://stglobal.tech/linkedin"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent"
							>
							<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
							</svg>
							</a>
							<a
							href="https://stglobal.tech/facebook"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent"
							>
							<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-2.844c0-2.785 1.695-4.3 4.185-4.3 1.185 0 2.204.088 2.503.127v2.9h-1.717c-1.347 0-1.608.64-1.608 1.582v2.535h3.218l-.418 3.667h-2.8v7.98H9.101z"/>
							</svg>
							</a>
							<a
							href="https://stglobal.tech/twitter"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent"
							>
							<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
							</svg>
							</a>
							<a
							href="https://instagram.com"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent"
							>
							<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
							</svg>
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
