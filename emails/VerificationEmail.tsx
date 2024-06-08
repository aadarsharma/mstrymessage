import {
    Html,
    Head,
    Link,
    Body,
    Heading,
    Row,
    Section,
    Text,
    Button,
} from '@react-email/components';

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export const VerificationEmail: React.FC<VerificationEmailProps> = ({ username, otp }) => {
    return (
        <Html lang="en">
            <Head>
                <Link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet" />
            </Head>
            <Body>
                <Section>
                    <Row>
                        <Heading>Verify your account</Heading>
                    </Row>
                    <Row>
                        <Text>
                            Hi {username},
                        </Text>
                        <Text>
                            Your verification code is: {otp}
                        </Text>
                    </Row>
                    <Row>
                        <Button href="https://example.com/verify">Verify</Button>
                    </Row>
                </Section>
            </Body>
        </Html>
    );
};
