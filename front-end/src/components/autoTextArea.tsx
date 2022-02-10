import { border } from "@chakra-ui/react";
import React, {
	useState,
	useEffect,
	useRef,
	TextareaHTMLAttributes,
} from "react";

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
				minHeight: parentHeight,
				backgroundColor: '#151516',
			}}
		>
			<textarea
				{...props}
				ref={textAreaRef}
				rows={3}
				color={'#151516'}
				style={{
					height: textAreaHeight,
					backgroundColor: '#151516',
					textAlign: 'center',
					color: 'white',
					borderColor: 'white',
					borderWidth: '1px',
					borderRadius: '10px',
					minWidth: '15vw',
					paddingTop: '10px',
					paddingBottom: '10px',
				}}
				onChange={onChangeHandler}
			/>
		</div>
	);
};

export default AutoTextArea;