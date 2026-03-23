interface ProvisionalSubscribeProps extends React.HTMLAttributes<HTMLElement> {
	data: {
		title?: string;
		visible?: boolean;
		iframeUrl?: string;
		showClosedMessage?: boolean;
		closedMessage?: string;
	};
}

export function ProvisionalSubscribe({
	data,
	...props
}: ProvisionalSubscribeProps) {
	const { title, visible, iframeUrl, showClosedMessage, closedMessage } = data;
	const sectionId = "provisional-subscribe";

	if (!visible) {
		return null;
	}

	const showClosed = !!showClosedMessage;
	const showIframe = !showClosed && !!iframeUrl;

	if (!showClosed && !showIframe) {
		return null;
	}

	return (
		<section
			id={sectionId}
			className="w-full py-12 md:py-16 px-4 md:px-8"
			{...props}
		>
			<div className="max-w-6xl mx-auto">
				{title && (
					<h2 className="text-3xl md:text-4xl font-bold mb-8 text-center font-title">
						{title}
					</h2>
				)}
				{showClosed && (
					<div className="text-center text-lg text-muted-foreground py-8">
						{closedMessage || "Inscrições encerradas"}
					</div>
				)}
				{showIframe && (
					<iframe
						src={iframeUrl}
						width="100%"
						height={1200}
						className=" overflow-hidden "
						title={title || "Inscrição"}
					/>
				)}
			</div>
		</section>
	);
}
