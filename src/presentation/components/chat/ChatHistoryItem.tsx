import { ChatHistoryMenu } from "./ChatHistoryMenu";

<div className="history-row">

<button>

{session.isPinned && "📌"}

{session.title}

</button>

<button>

•••

</button>

{
menuOpen &&
<ChatHistoryMenu/>

}