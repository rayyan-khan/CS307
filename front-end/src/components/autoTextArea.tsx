import { border } from "@chakra-ui/react";
import React, {
	useState,
	useEffect,
	useRef,
	TextareaHTMLAttributes,
} from "react";
import "./navbar/navbar.css";

const AutoTextArea = (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => {
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const [text, setText] = useState("");
	const [textAreaHeight, setTextAreaHeight] = useState("auto");
	const [parentHeight, setParentHeight] = useState("auto");

	useEffect(() => {
		setParentHeight(`${textAreaRef.current!.scrollHeight}px`);
		setTextAreaHeight(`${textAreaRef.current!.scrollHeight}px`);
	}, [text]);

	const onChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setTextAreaHeight("auto");
		setParentHeight(`${textAreaRef.current!.scrollHeight}px`);
		setText(event.target.value);

		if (props.onChange) {
			props.onChange(event);
		}
	};

	return (
		<div
			style={{
				borderColor: 'var(--text-color)',
				borderWidth: '1px',
				borderRadius: '10px',
			}}
		>
			<div
				style={{
					padding: '3px',
					minHeight: parentHeight,
					backgroundColor: 'var(--main-color)',
					borderRadius: '10px',
				}}
			>
				<textarea
					{...props}
					ref={textAreaRef}
					rows={3}
					color={'var(--text-color)'}
					style={{
						height: textAreaHeight,
						backgroundColor: 'var(--main-color)',
						textAlign: 'center',
						color: 'var(--text-color)',
						minWidth: '15vw',
						paddingTop: '10px',
						paddingBottom: '10px',
					}}
					onChange={onChangeHandler}
				/>
		</div>
		</div>
	);
};

export default AutoTextArea;