import Head from 'next/head';
import {
	Container,
	Button,
	HStack,
	Spacer,
	Heading,
	Text,
	VStack,
	View,
} from '@wp-g2/components';
import { ui } from '@wp-g2/styles';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import { v4 as uuid } from 'uuid';
import faker from 'faker';
import {
	sortableContainer,
	sortableElement,
	sortableHandle,
} from 'react-sortable-hoc';
import arrayMove from 'array-move';

const DragHandle = sortableHandle(() => (
	<View
		css={[
			{ cursor: 'grab', opacity: 0, transition: 'all 100ms linear' },
			`&:active { cursor: grabbing; }`,
			`*:hover > & { opacity: 1;}`,
		]}
		className="dragHandle"
	>
		::
	</View>
));
const SortableItem = sortableElement(({ block, onRemove }) => {
	return (
		<motion.div
			key={block.id}
			exit={{
				opacity: 0,
			}}
			exit={{
				height: [null, 0],
				overflow: 'hidden',
				opacity: [1, 0],
			}}
			transition={{ duration: 0.16 }}
		>
			<HStack alignment="top">
				<DragHandle />
				<Spacer>
					<AnimationWrapper
						id={block.id}
						onRemove={onRemove(block.id)}
					>
						<ExampleBlock>{block.content}</ExampleBlock>
					</AnimationWrapper>
				</Spacer>
			</HStack>
		</motion.div>
	);
});

const SortableList = sortableContainer(({ items, onRemove }) => {
	return (
		<div>
			<AnimatePresence initial={false}>
				{items.map((block, index) => (
					<SortableItem
						index={index}
						key={block.id}
						block={block}
						onRemove={onRemove}
					/>
				))}
			</AnimatePresence>
		</div>
	);
});

const ExampleBlock = ({ children, transform }) => (
	<View css={{ fontSize: 16, lineHeight: 1.5, marginBottom: `1.5em` }}>
		{children}
	</View>
);

const AnimationWrapper = ({ children, id, onRemove }) => {
	return (
		<motion.div
			onClick={onRemove}
			key={id}
			initial={{ scale: 0.95, opacity: 0 }}
			animate={{ scale: [0.95, 1.025, 1], opacity: [0, 1] }}
			transition={{ duration: 0.16 }}
		>
			{children}
		</motion.div>
	);
};

const createBlock = () => ({ id: uuid(), content: faker.lorem.paragraph() });

export default function Home() {
	const [blocks, setBlocks] = React.useState([
		createBlock(),
		createBlock(),
		createBlock(),
	]);

	const addBlock = () => setBlocks((prev) => [...prev, createBlock()]);
	const removeBlock = (id) => () =>
		setBlocks((prev) => {
			return prev.filter((block) => block.id !== id);
		});

	const onSortEnd = ({ oldIndex, newIndex }) => {
		setBlocks((prev) => arrayMove(prev, oldIndex, newIndex));
	};

	return (
		<View>
			<Head>
				<title>G2</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Container width={720} css={{ marginTop: '10vh' }}>
				<View>
					<Text variant="muted">Click Paragraph to delete</Text>
				</View>
				<Spacer mb={5} />
				<VStack spacing={10}>
					<HStack alignment="left">
						<Button onClick={addBlock}>Add Block</Button>
					</HStack>
					<SortableList
						lockAxis="y"
						axis="y"
						useDragHandle
						items={blocks}
						onRemove={removeBlock}
						onSortEnd={onSortEnd}
					/>
				</VStack>
			</Container>
		</View>
	);
}
