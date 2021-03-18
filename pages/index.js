import Head from 'next/head';
import {
	Container,
	Button,
	HStack,
	Spacer,
	Grid,
	Heading,
	Text,
	VStack,
	View,
} from '@wp-g2/components';
import { ui, css } from '@wp-g2/styles';
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

const sortingStyles = css`
	p:only-child {
		background: white;
	}
`;

const bounceScaleIn = [1, 1.01, 1];

const DragHandle = sortableHandle(() => (
	<View
		css={[
			{ cursor: 'grab', opacity: 0, transition: 'all 100ms linear' },
			`&:active { cursor: grabbing; }`,
			`*:hover > div > & { opacity: 1;}`,
		]}
		className="dragHandle"
	>
		::
	</View>
));

const SortableItem = sortableElement(({ block, onRemove, onTransform }) => {
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
				<VStack>
					<DragHandle />
					<View
						className="dragHandle"
						onClick={onRemove(block.id)}
						css={[
							{
								cursor: 'pointer',
								opacity: 0,
								transition: 'all 100ms linear',
							},
							`*:hover > div > & { opacity: 1;}`,
						]}
					>
						X
					</View>
				</VStack>
				<Spacer>
					<AnimationWrapper
						id={block.id}
						onTransform={onTransform(block.id)}
					>
						<ExampleBlock transform={block.transform}>
							{block.content}
						</ExampleBlock>
					</AnimationWrapper>
				</Spacer>
			</HStack>
		</motion.div>
	);
});

const SortableList = sortableContainer(({ items, onRemove, onTransform }) => {
	return (
		<div>
			<AnimatePresence initial={false}>
				{items.map((block, index) => (
					<SortableItem
						index={index}
						key={block.id}
						block={block}
						onRemove={onRemove}
						onTransform={onTransform}
					/>
				))}
			</AnimatePresence>
		</div>
	);
});

const forceNoAnimationTransition = css`
	transform: none !important;
`;
const ExampleBlock = ({ children, transform }) => {
	const content = children.split('. ');

	return (
		<View css={{ position: 'relative' }}>
			<AnimatePresence initial={false}>
				<motion.div key="layout" layout transition={{ duration: 0.12 }}>
					{transform ? (
						<motion.div
							key={'yes'}
							initial={{ opacity: 0 }}
							animate={{
								scale: bounceScaleIn,
								opacity: [0, 1],
								transition: { delay: 0.06, duration: 0.16 },
							}}
							exit={{
								position: 'absolute',
								top: 0,
								left: 0,
								opacity: 0,
								transition: {
									delay: 0,
								},
							}}
						>
							<Grid
								columns={3}
								css={{
									background: '#eee',
									padding: 20,
									borderRadius: 8,
									marginBottom: `1.5em`,
								}}
							>
								{content.map((c, i) => (
									<View
										as="p"
										css={{
											fontSize: 16,
											lineHeight: 1.5,
										}}
										key={i}
									>
										{c}
									</View>
								))}
							</Grid>
						</motion.div>
					) : (
						<motion.div
							key={'no'}
							initial={{ opacity: 0 }}
							animate={{
								scale: bounceScaleIn,
								opacity: [0, 1],
								transition: { delay: 0.06, duration: 0.16 },
							}}
						>
							<View
								as="p"
								css={{
									fontSize: 16,
									lineHeight: 1.5,
									marginBottom: `1.5em`,
								}}
							>
								{children}
							</View>
						</motion.div>
					)}
				</motion.div>
			</AnimatePresence>
		</View>
	);
};

const AnimationWrapper = ({ children, id, onRemove, onTransform }) => {
	return (
		<motion.div
			key={id}
			initial={{ opacity: 0 }}
			animate={{ scale: bounceScaleIn, opacity: [0, 1] }}
			transition={{ duration: 0.16 }}
			onClick={onTransform}
		>
			{children}
		</motion.div>
	);
};

const createBlock = () => ({
	id: uuid(),
	content: faker.lorem.paragraph(),
	transform: false,
});

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

	const transformBlock = (id) => () =>
		setBlocks((prev) => {
			return prev.map((block) => {
				if (block.id === id)
					return { ...block, transform: !block.transform };
				return block;
			});
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
					<Text variant="muted">
						Click Paragraph to <strong>transform</strong>. Click X
						to delete.
					</Text>
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
						helperClass={sortingStyles}
						onRemove={removeBlock}
						onTransform={transformBlock}
						onSortEnd={onSortEnd}
					/>
				</VStack>
			</Container>
		</View>
	);
}
