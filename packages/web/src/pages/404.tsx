import { PageError } from "components/Layout/PageError"
import { Link } from "components/Primitives/Link"

export default function NotFoundPage() {
  return (
    <PageError message="Are you lost?">
      <Link href="/">Bring me home.</Link>
    </PageError>
  )
}
