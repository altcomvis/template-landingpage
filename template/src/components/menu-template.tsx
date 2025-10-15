import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

/* ─────────────── Tipos ─────────────── */
interface MenuItem {
	id: string;
	label: string;
	href: string;
	visible: boolean;
}

interface MenuTemplateProps {
	logo?: string;
	menuItems: MenuItem[];
}

export function MenuTemplate({ logo, menuItems }: MenuTemplateProps) {
	const [open, setOpen] = useState(false);
	const [isFixed, setIsFixed] = useState(false);

	// 🔹 Efeito para fixar o menu ao rolar a página
	useEffect(() => {
		const handleScroll = () => setIsFixed(window.scrollY > 10);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const visibleItems = menuItems.filter((item) => item.visible);

	return (
		<div
			className={`md:w-full md:flex md:justify-center ${
				isFixed ? "md:pt-14" : "pt-0"
			}`}
		>
			<header
				className={`md:rounded-full md:px-12 z-50 transition-all duration-300 ${
					isFixed
						? "fixed md:top-3 md:bg-white/75 md:backdrop-blur-lg md:shadow-lg md:border border-zinc-500"
						: "relative border-zinc-500"
				}`}
			>
				<div
					className={`container mx-auto px-4 md:py-3 flex md:justify-center items-center transition-all duration-500 ${
						isFixed ? "md:py-2 text-zinc-700" : "md:py-2 text-[var(--text)]"
					}`}
				>
					{/* Menu Desktop */}
					<nav className="hidden md:flex gap-6 text-base font-medium">
						{visibleItems.map(({ href, label }) => (
							<ScrollLink
								key={href}
								to={href}
								smooth
								duration={600}
								offset={-80}
								className="group relative cursor-pointer transition-all duration-300"
							>
								<span className="transition-all duration-200 group-hover:scale-105 group-hover:opacity-90">
									{label}
								</span>
								<span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[var(--light)] transition-all duration-300 group-hover:w-full" />
							</ScrollLink>
						))}
					</nav>

					{/* Menu Mobile */}
					<div className="md:hidden absolute top-4 left-4">
						<Sheet open={open} onOpenChange={setOpen}>
							<SheetTrigger asChild>
								<Button
									variant="outline"
									className="bg-zinc-200 shadow-lg border"
									size="icon"
								>
									<Menu className="text-zinc-500" />
								</Button>
							</SheetTrigger>

							<SheetContent
								side="top"
								className="p-6 bg-zinc-700/90 backdrop-blur-md text-zinc-100 h-screen border-none"
							>
								<SheetHeader className="p-0 w-full">
									<SheetTitle className="p-0 mx-auto pt-16">
										{logo ? (
											<img
												src={logo}
												className="w-32 mx-auto"
												alt="Logo do Projeto"
											/>
										) : null}
									</SheetTitle>

									<SheetDescription className="p-0">
										<span className="flex flex-col gap-6 font-medium text-2xl mt-8 text-center justify-center items-center py-4">
											{visibleItems.map(({ href, label }) => (
												<ScrollLink
													key={href}
													to={href}
													smooth
													duration={600}
													offset={-80}
													className="cursor-pointer text-zinc-300"
													onClick={() => setOpen(false)}
												>
													{label}
												</ScrollLink>
											))}
										</span>
									</SheetDescription>
								</SheetHeader>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</header>
		</div>
	);
}
