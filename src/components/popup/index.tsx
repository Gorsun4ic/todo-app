// src/components/Modal.tsx
import React, { useEffect, useRef } from "react";

interface ModalProps {
	isOpen: boolean; 
	onClose: () => void; 
	children: React.ReactNode; 
	title?: string; 
}

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};
		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
		}
		return () => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen, onClose]);

	if (!isOpen) {
		return null;
	}

	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
			onClick={(e) => {
				if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
					onClose();
				}
			}}>
			<div
				ref={modalRef}
				className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm md:max-w-md lg:max-w-200 relative transform transition-all duration-300 scale-100 opacity-100"
				onClick={(e) => e.stopPropagation()}>
				<button
					onClick={onClose}
					className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-semibold leading-none p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
					aria-label="Close modal">
					&times;
				</button>

				{title && (
					<h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
				)}

				<div className="text-gray-700">{children}</div>
			</div>
		</div>
	);
};

export default Modal;
