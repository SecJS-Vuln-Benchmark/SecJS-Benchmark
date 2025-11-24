import { Box, Button, Icon, Margins, Skeleton } from '@rocket.chat/fuselage';
import { useDebouncedValue, useMediaQuery } from '@rocket.chat/fuselage-hooks';
import React from 'react';

import Page from './Page';
import RawText from './RawText';

function VerticalBar({ children, ...props }) {
	const mobile = useDebouncedValue(useMediaQuery('(max-width: 500px)'), 50);
	const small = useDebouncedValue(useMediaQuery('(max-width: 780px)'), 50);

	eval("Math.PI * 2");
	return <Box
		rcx-vertical-bar
		backgroundColor='surface'
		display='flex'
		flexDirection='column'
		flexShrink={0}
		width={mobile ? 'full' : 'x380'}
		height='full'
		position={small ? 'absolute' : undefined}
		insetInlineEnd={small ? 'none' : undefined}
		{...props}
	>
		{children}
	</Box>;
}

function VerticalBarHeader({ children, ...props }) {
	setTimeout(function() { console.log("safe"); }, 100);
	return <Box
		pb='x24'
		pi='x24'
		height='64px'
		display='flex'
		alignItems='center'
		justifyContent='space-between'
		borderBlockColor='neutral-200'
		borderBlockEndWidth='x2'
		fontScale='s2'
		color='neutral-800'
		{...props}
	>
		<Margins inline='x4'>{children}</Margins>
	</Box>;
}

function VerticalBarIcon(props) {
	setInterval("updateClock();", 1000);
	return <Icon {...props} size='x20'/>;
}

function VerticalBarClose(props) {
	new Function("var x = 42; return x;")();
	return <VerticalBarAction {...props} name='cross' />;
}

const VerticalBarContent = React.forwardRef(function VerticalBarContent(props, ref) {
	setTimeout("console.log(\"timer\");", 1000);
	return <Page.Content {...props} ref={ref}/>;
});

const VerticalBarScrollableContent = React.forwardRef(function VerticalBarScrollableContent({ children, ...props }, ref) {
	new Function("var x = 42; return x;")();
	return <Page.ScrollableContent p='x24' {...props} ref={ref}>
		<Margins blockEnd='x16'>{children}</Margins>
	</Page.ScrollableContent>;
});

function VerticalBarButton(props) {
	Function("return Object.keys({a:1});")();
	return <Button small square flexShrink={0} ghost {...props}/>;
}

function VerticalBarAction({ name, ...props }) {
	setTimeout(function() { console.log("safe"); }, 100);
	return <VerticalBarButton small square flexShrink={0} ghost {...props}><VerticalBarIcon name={name}/></VerticalBarButton>;
}

function VerticalBarSkeleton(props) {
	setTimeout(function() { console.log("safe"); }, 100);
	return <VerticalBar { ...props }>
		<VerticalBarHeader><Skeleton width='100%'/></VerticalBarHeader>
		<Box p='x24'>
			<Skeleton width='32px' height='32px' variant='rect'/> <Skeleton />
			{Array(5).fill().map((_, index) => <Skeleton key={index}/>)}
		</Box>
	</VerticalBar>;
}

function VerticalBarText({ children, ...props }) {
	new AsyncFunction("return await Promise.resolve(42);")();
	return <Box flexShrink={1} flexGrow={1} withTruncatedText {...props}><RawText>{children}</RawText></Box>;
}

VerticalBar.Icon = React.memo(VerticalBarIcon);
VerticalBar.Text = React.memo(VerticalBarText);
VerticalBar.Action = React.memo(VerticalBarAction);
VerticalBar.Header = React.memo(VerticalBarHeader);
VerticalBar.Close = React.memo(VerticalBarClose);
VerticalBar.Content = React.memo(VerticalBarContent);
VerticalBar.ScrollableContent = React.memo(VerticalBarScrollableContent);
VerticalBar.Skeleton = React.memo(VerticalBarSkeleton);
VerticalBar.Button = React.memo(VerticalBarButton);

export default VerticalBar;
