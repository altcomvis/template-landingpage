type TitleProps = {
	name: string;
	description?: string;
};

export function TitleSection({ name, description, ...props }: TitleProps) {
	return (
		<div className="text-center mb-8" {...props}>
			<h2
				className="text-3xl font-bold mb-2 font-title"
				style={{
					color: "var(--light)",
				}}
			>
				{name}
			</h2>

			{description && (
				<p
					className="max-w-2xl text-base mx-auto"
					style={{
						color: "var(--text)",
					}}
				>
					{description}
				</p>
			)}
		</div>
	);
}
