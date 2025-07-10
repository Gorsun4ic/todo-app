// src/components/Checkpoint.tsx
interface CheckpointProps {
	active?: boolean;
	size?: "small" | "medium" | "large";
	label?: string;
	className?: string;
	onClick?: () => void;
}

const Checkpoint = ({
	active = false,
	label,
	className,
	onClick
}: CheckpointProps) => {
	const colorClasses = active ? "bg-green-500" : "bg-gray-300";

	return (
		<div
			className={`flex items-center space-x-2 ${
				className || ""
			} cursor-pointer`}
			onClick={onClick}>
			<div
				className={`rounded-full w-7 h-7 ${colorClasses} flex-shrink-0`}></div>
			{label && (
				<span
					className={`text-gray-700 text-sm ${active ? "font-semibold" : ""}`}>
					{label}
				</span>
			)}
		</div>
	);
};

export default Checkpoint;
