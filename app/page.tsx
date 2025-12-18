"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Composer from "@/components/Composer";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {posts.map((post) =>
          post.comments.map((node, i) => <Comment node={node} key={i} />)
        )}
      </main>
    </div>
  );
}

interface Author {
  fname?: string;
}

interface CommentNode {
  id: string;
  author?: Author | null;
  guest?: string | null;
  comment: string;
  parent_id?: string | null;
  replies?: CommentNode[];
}

interface CommentProps {
  node: CommentNode;
  depth?: number;
  maxDepth?: number;
}

const Comment = ({ node, depth = 0, maxDepth = 3 }: CommentProps) => {
  const [showReplies, setShowReplies] = useState(false);
  const childCount = countAllReplies(node);
  const [composer, setComposer] = useState(false);

  return (
    <div className="comment relative">
      <div className="flex gap-2 py-2 px-3 max-w-sm mb-1">
        <div className="avatar-wrap">
          <img src="https://i.pravatar.cc/150" className="avatar" />
        </div>
        <div>
          <div className="bg-slate-200 py-1 px-3 rounded-xl text-sm">
            <span className="font-bold">
              {node.author?.fname || node.guest || "Anonymous"}
            </span>
            <p>{node.comment}</p>
          </div>
          <div className="comment-footer">
            <span>Like</span>
            <span onClick={() => setComposer(!composer)}>Reply</span>

            {childCount > 0 && showReplies && (
              <span
                className="cursor-pointer font-medium"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies
                  ? `Hide repl${childCount !== 1 ? "ies" : "y"}`
                  : ""}
              </span>
            )}

            <span>· {depth}</span>
          </div>
        </div>
      </div>

      {/* COLLAPSED STATE: SHOW TOGGLE ROW */}
      {childCount > 0 && !showReplies && (
        <div
          className="reply-toggle-row ml-11 mt-1 cursor-pointer"
          onClick={() => setShowReplies(!showReplies)}
        >
          <span className="text-sm text-blue-600 ml-2">
            View {childCount} repl{`${childCount !== 1 ? "ies" : "y"}`}
          </span>
        </div>
      )}

      {/* Replies */}
      {showReplies && depth < maxDepth && node.replies?.length ? (
        <AnimatePresence initial={false}>
          {node.replies.map((reply, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="reply relative ml-11"
            >
              <Comment node={reply} depth={depth + 1} maxDepth={maxDepth} />
            </motion.div>
          ))}

          {/* COLLAPSE CONTROL BELOW REPLIES (FB STYLE) */}
          {/* {childCount > 0 && (
            <span
              onClick={() => setShowReplies(!showReplies)}
              className="ml-11 mt-1 cursor-pointer text-sm text-blue-600 font-medium"
            >
              Hide replies
            </span>
          )} */}
        </AnimatePresence>
      ) : null}

      {composer && <Composer />}
    </div>
  );
};

const countAllReplies = (node: CommentNode): number => {
  if (!node.replies) return 0;
  return node.replies.reduce(
    (total, reply) => total + 1 + countAllReplies(reply),
    0
  );
};

const posts = [
  {
    id: "9f233b7a-813b-41ec-a57a-e30e262d733b",
    user_id: "dace4d2e-d909-4f9e-aed0-2ec185eed08e",
    title: "Understanding REST APIs",
    text: "A simple guide to how RESTful APIs work and why they are widely used.",
    files: [],
    published: false,
    created_at: "2025-11-25T21:55:19.153975+00:00",
    updated_at: "2025-11-25T21:55:19.153975+00:00",
    profiles: {
      fname: "Cynthia",
      lname: "Adaji",
      avatar_url: "dace4d2e-d909-4f9e-aed0-2ec185eed08e/1763748126497.png",
    },
    likes: [],
    shares: [],
    comments: [
      {
        id: "4f46ec82-12f3-496a-b2ef-c4373f9316bc",
        files: [
          "https://xlvrushndhimqhihcyqw.supabase.co/storage/v1/object/public/blog/public/comments/react_perf.png",
        ],
        guest: "GuestIan",
        likes: [],
        author: null,
        comment: "React performance tips are awesome!",
        post_id: "9f233b7a-813b-41ec-a57a-e30e262d733b",
        user_id: null,
        parent_id: null,
        created_at: "2025-11-28T01:33:22.733752+00:00",
        updated_at: "2025-11-28T01:33:22.733752+00:00",
        replies: [],
      },
    ],
  },
  {
    id: "09550e44-f580-45ae-bf65-b317029d600f",
    user_id: "ca6611b0-0980-4e83-bfda-14257540a9fe",
    title: "Understanding Cloud Architecture",
    text: "Setting price is as much behavioral as it is arithmetic. In our earliest experiments we priced purely on cost plus margin and were surprised by the results: a lower tier with too many features cannibalized uptake for the higher tier, and enterprise prospects ignored our 'standard' tier entirely.\\n\\nThe work that changed our approach combined simple experiments with classic behavioral nudges. We introduced a decoy plan, packaged features into outcome-focused tiers (starter: quick wins, growth: measurable ROI, enterprise: customization & support), and tested anchoring by presenting the enterprise plan first. Within a month we observed a significant shift in choice architecture — more customers self-selected into the growth tier which delivered the best lifetime value.\\n\\nCrucial to success was measuring real signals: time to first value, churn in month three, and support touch frequency. Pricing isn't fixed; it is dynamic and should be paired with product improvements and tightened onboarding flows. For founders, the practical takeaway is simple: price for outcomes, not hours. Test the anchors, watch for churn regressors, and be ready to simplify offerings into clear stories that buyers can understand quickly.",
    files: [
      "https://xlvrushndhimqhihcyqw.supabase.co/storage/v1/object/public/blog/3.jpg",
    ],
    published: false,
    created_at: "2025-11-25T21:55:19.153975+00:00",
    updated_at: "2025-11-25T21:55:19.153975+00:00",
    profiles: {
      fname: "Edna",
      lname: "Adaji",
      avatar_url: "ca6611b0-0980-4e83-bfda-14257540a9fe/1763748126497.png",
    },
    likes: [],
    shares: [],
    comments: [
      {
        id: "14d59ff7-8cb4-408b-8007-9721fe4cafb1",
        files: [],
        guest: null,
        likes: [],
        author: {
          fname: "Cynthia",
          lname: "Adaji",
          avatar_url: "dace4d2e-d909-4f9e-aed0-2ec185eed08e/1763748126497.png",
        },
        comment: "Cloud architecture explained clearly!",
        post_id: "09550e44-f580-45ae-bf65-b317029d600f",
        user_id: "dace4d2e-d909-4f9e-aed0-2ec185eed08e",
        parent_id: null,
        created_at: "2025-11-28T01:33:22.733752+00:00",
        updated_at: "2025-11-28T01:33:22.733752+00:00",
        replies: [],
      },
      {
        id: "38533581-2d74-4619-a700-d8208ba35581",
        files: [
          "https://xlvrushndhimqhihcyqw.supabase.co/storage/v1/object/public/blog/public/comments/cloud_diagram.png",
        ],
        guest: "GuestCharlie",
        likes: [],
        author: null,
        comment: "Helpful visual diagrams.",
        post_id: "09550e44-f580-45ae-bf65-b317029d600f",
        user_id: null,
        parent_id: null,
        created_at: "2025-11-28T01:33:22.733752+00:00",
        updated_at: "2025-11-28T01:33:22.733752+00:00",
        replies: [
          {
            id: "1022b8d0-0df2-4f07-952b-62899842938e",
            files: [],
            guest: "GuestDana",
            likes: [],
            author: null,
            comment: "Security is key!",
            post_id: "09550e44-f580-45ae-bf65-b317029d600f",
            user_id: null,
            parent_id: "38533581-2d74-4619-a700-d8208ba35581",
            created_at: "2025-11-28T01:33:22.733752+00:00",
            updated_at: "2025-11-28T01:33:22.733752+00:00",
            replies: [],
          },
        ],
      },
      {
        id: "f43ab6a1-9f76-4776-9232-e70f693abcad",
        files: [],
        guest: null,
        likes: [],
        author: {
          fname: "Edna",
          lname: "Adaji",
          avatar_url: "ca6611b0-0980-4e83-bfda-14257540a9fe/1763748126497.png",
        },
        comment: "Can you expand on security considerations?",
        post_id: "09550e44-f580-45ae-bf65-b317029d600f",
        user_id: "ca6611b0-0980-4e83-bfda-14257540a9fe",
        parent_id: null,
        created_at: "2025-11-28T01:33:22.733752+00:00",
        updated_at: "2025-11-28T01:33:22.733752+00:00",
        replies: [],
      },
    ],
  },
  {
    id: "3155382c-a4ed-4a03-acc5-193e77fe3d42",
    user_id: "ca6611b0-0980-4e83-bfda-14257540a9fe",
    title: "JavaScript Tricks You Should Know",
    text: "Raising seed capital feels like a performance. You practice your pitch deck over and over, but the real preparation is aligning the story with demonstrable progress. Early on, we believed a great narrative alone would attract offers; in practice, investors wanted signals — engaged users, repeatable onboarding, and a handful of customers with clear willingness to pay.\\n\\nWe focused fundraising conversations on three metrics: growth in MRR, CAC payback, and a narrowly defined ICP. By showing improvements in those three areas and being transparent about churn and margins, conversations moved faster. Another lesson: not all capital is equal. We prioritized investors who added distribution or hiring help relevant to our stage rather than chasing a high valuation.\\n\\nFinally, manage your timeline. Fundraising noise consumes headspace. We designated mornings for investor outreach and afternoons for product work to preserve momentum. When you prepare for a round, document your thesis, be candid about risks, and use the process as a way to recruit partners who understand your path.",
    files: [
      "https://xlvrushndhimqhihcyqw.supabase.co/storage/v1/object/public/blog/6.jpg",
    ],
    published: true,
    created_at: "2025-11-25T21:55:19.153975+00:00",
    updated_at: "2025-11-25T21:55:19.153975+00:00",
    profiles: {
      fname: "Edna",
      lname: "Adaji",
      avatar_url: "ca6611b0-0980-4e83-bfda-14257540a9fe/1763748126497.png",
    },
    likes: [],
    shares: [],
    comments: [
      {
        id: "2a3f1a65-ead5-4785-920a-95f59455d22e",
        files: [],
        guest: null,
        likes: [],
        author: {
          fname: "Cynthia",
          lname: "Adaji",
          avatar_url: "dace4d2e-d909-4f9e-aed0-2ec185eed08e/1763748126497.png",
        },
        comment: "I use most of these VS Code extensions already!",
        post_id: "3155382c-a4ed-4a03-acc5-193e77fe3d42",
        user_id: "dace4d2e-d909-4f9e-aed0-2ec185eed08e",
        parent_id: null,
        created_at: "2025-11-28T01:33:22.733752+00:00",
        updated_at: "2025-11-28T01:33:22.733752+00:00",
        replies: [],
      },
    ],
  },
  {
    id: "cf59d3bb-26c5-468d-a7a8-9fac1e3cb67b",
    user_id: "ca6611b0-0980-4e83-bfda-14257540a9fe",
    title: "My Favorite VS Code Extensions",
    text: "These extensions have boosted my productivity tremendously.",
    files: [
      "https://xlvrushndhimqhihcyqw.supabase.co/storage/v1/object/public/blog/10.jpg",
    ],
    published: false,
    created_at: "2025-11-25T21:55:19.153975+00:00",
    updated_at: "2025-11-25T21:55:19.153975+00:00",
    profiles: {
      fname: "Edna",
      lname: "Adaji",
      avatar_url: "ca6611b0-0980-4e83-bfda-14257540a9fe/1763748126497.png",
    },
    likes: [],
    shares: [],
    comments: [
      {
        id: "97daf12d-1504-4517-9151-b7147e550006",
        files: [],
        guest: null,
        likes: [],
        author: {
          fname: "Edna",
          lname: "Adaji",
          avatar_url: "ca6611b0-0980-4e83-bfda-14257540a9fe/1763748126497.png",
        },
        comment: "Design systems make teamwork easier.",
        post_id: "cf59d3bb-26c5-468d-a7a8-9fac1e3cb67b",
        user_id: "ca6611b0-0980-4e83-bfda-14257540a9fe",
        parent_id: null,
        created_at: "2025-11-28T01:33:22.733752+00:00",
        updated_at: "2025-11-28T01:33:22.733752+00:00",
        replies: [],
      },
    ],
  },
  {
    id: "14fa9a61-451c-495f-9d20-e3cf2524cbdd",
    user_id: "ca6611b0-0980-4e83-bfda-14257540a9fe",
    title: "Deploying to Production Seamlessly",
    text: "Turning a side project into a sustainable business is equal parts discipline and leverage. My co-founder started a content-heavy newsletter while working full time; I joined later and helped turn the traction into a productized service. The playbook we used focused on three pillars: productize a core service, systemize distribution, and limit scope until revenue proved repeatable.\\n\\nProductization meant extracting the most valuable outcome clients paid for (not the full bespoke service) and building a repeatable deliverable. Systemizing distribution involved a referral engine embedded into onboarding — small prompts asking early customers for introductions in exchange for discounts.\\n\\nThe hardest part for many founders is saying no. We resisted feature creep aggressively in the first 12 months and focused on a narrow vertical where our messages resonated. That focus allowed us to optimize processes and margins. Today, the business supports two full-time employees and a modest local ad spend that reliably brings in leads. The lesson: start with a repeatable offer, create predictable paths for discovery and referrals, and don’t expand until the unit economics are proven.",
    files: [
      "https://xlvrushndhimqhihcyqw.supabase.co/storage/v1/object/public/blog/4.jpg",
      "https://xlvrushndhimqhihcyqw.supabase.co/storage/v1/object/public/blog/5.jpg",
    ],
    published: true,
    created_at: "2025-11-25T21:55:19.153975+00:00",
    updated_at: "2025-11-25T21:55:19.153975+00:00",
    profiles: {
      fname: "Edna",
      lname: "Adaji",
      avatar_url: "ca6611b0-0980-4e83-bfda-14257540a9fe/1763748126497.png",
    },
    likes: [],
    shares: [],
    comments: [
      {
        id: "71d2cfba-25f2-4f83-b1d2-69cf6a285540",
        files: [],
        guest: null,
        likes: [
          {
            id: "f41ecf55-8b62-444d-a1c1-a873b50b48f6",
            guest: null,
            post_id: null,
            user_id: "a011cebe-1b5e-4972-bd00-fcfb188725a3",
            comment_id: "71d2cfba-25f2-4f83-b1d2-69cf6a285540",
            created_at: "2025-11-28T12:34:11.327272+00:00",
            like_actor: "a011cebe-1b5e-4972-bd00-fcfb188725a3",
            updated_at: "2025-11-28T12:34:11.327272+00:00",
          },
        ],
        author: {
          fname: "Edna",
          lname: "Adaji",
          avatar_url: "ca6611b0-0980-4e83-bfda-14257540a9fe/1763748126497.png",
        },
        comment: "Daily habits really help coding growth.",
        post_id: "14fa9a61-451c-495f-9d20-e3cf2524cbdd",
        user_id: "ca6611b0-0980-4e83-bfda-14257540a9fe",
        parent_id: null,
        created_at: "2025-11-28T01:33:22.733752+00:00",
        updated_at: "2025-11-28T01:33:22.733752+00:00",
        replies: [],
      },
      {
        id: "6b1cefb0-cea2-4e5d-a2b7-7c8b5280cbcb",
        files: [],
        guest: "GuestEve",
        likes: [],
        author: null,
        comment: "Thanks for these tips!",
        post_id: "14fa9a61-451c-495f-9d20-e3cf2524cbdd",
        user_id: null,
        parent_id: null,
        created_at: "2025-11-28T01:33:22.733752+00:00",
        updated_at: "2025-11-28T01:33:22.733752+00:00",
        replies: [
          {
            id: "b025bf5f-f60c-445e-b6c7-a3b680fbcb93",
            files: [],
            guest: null,
            likes: [
              {
                id: "ee0fe836-cd98-4916-acd9-1b37e3454c8f",
                guest: null,
                post_id: null,
                user_id: "a011cebe-1b5e-4972-bd00-fcfb188725a3",
                comment_id: "b025bf5f-f60c-445e-b6c7-a3b680fbcb93",
                created_at: "2025-11-28T14:15:37.34567+00:00",
                like_actor: "a011cebe-1b5e-4972-bd00-fcfb188725a3",
                updated_at: "2025-11-28T14:15:37.34567+00:00",
              },
            ],
            author: {
              fname: "Cynthia",
              lname: "Adaji",
              avatar_url:
                "dace4d2e-d909-4f9e-aed0-2ec185eed08e/1763748126497.png",
            },
            comment: "Which tip did you like most?",
            post_id: "14fa9a61-451c-495f-9d20-e3cf2524cbdd",
            user_id: "dace4d2e-d909-4f9e-aed0-2ec185eed08e",
            parent_id: "6b1cefb0-cea2-4e5d-a2b7-7c8b5280cbcb",
            created_at: "2025-11-28T01:33:22.733752+00:00",
            updated_at: "2025-11-28T01:33:22.733752+00:00",
            replies: [
              {
                id: "3004fa15-0254-4bf1-8b31-225f572e6c45",
                files: [],
                guest: null,
                likes: [],
                author: {
                  fname: "Eneojo",
                  lname: "Amobeda",
                  avatar_url:
                    "a011cebe-1b5e-4972-bd00-fcfb188725a3/1763748126497.png",
                },
                comment: "The obvious one of course.",
                post_id: "14fa9a61-451c-495f-9d20-e3cf2524cbdd",
                user_id: "a011cebe-1b5e-4972-bd00-fcfb188725a3",
                parent_id: "b025bf5f-f60c-445e-b6c7-a3b680fbcb93",
                created_at: "2025-11-29T01:36:29.766341+00:00",
                updated_at: "2025-11-29T01:36:29.766341+00:00",
                replies: [],
              },
            ],
          },
          {
            id: "5b07da56-0d80-4fbe-b361-0deb79ae3caa",
            files: [],
            guest: "Anonymous",
            likes: [
              {
                id: "1bb38e9b-575c-4c61-938b-2333478d9def",
                guest: null,
                post_id: null,
                user_id: "a011cebe-1b5e-4972-bd00-fcfb188725a3",
                comment_id: "5b07da56-0d80-4fbe-b361-0deb79ae3caa",
                created_at: "2025-12-01T10:43:38.663227+00:00",
                like_actor: "a011cebe-1b5e-4972-bd00-fcfb188725a3",
                updated_at: "2025-12-01T10:43:38.663227+00:00",
              },
            ],
            author: null,
            comment: "What are you saying?",
            post_id: "14fa9a61-451c-495f-9d20-e3cf2524cbdd",
            user_id: null,
            parent_id: "6b1cefb0-cea2-4e5d-a2b7-7c8b5280cbcb",
            created_at: "2025-11-29T01:40:56.889465+00:00",
            updated_at: "2025-11-29T01:40:56.889465+00:00",
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: "d807e672-2f5f-4a1f-9b7f-e44703ec5074",
    user_id: "dace4d2e-d909-4f9e-aed0-2ec185eed08e",
    title: "Getting Started with UI/UX Design",
    text: "Simple principles every beginner designer should follow.",
    files: [
      "https://xlvrushndhimqhihcyqw.supabase.co/storage/v1/object/public/blog/11.jpg",
      "https://xlvrushndhimqhihcyqw.supabase.co/storage/v1/object/public/blog/12.jpg",
    ],
    published: true,
    created_at: "2025-11-25T21:55:19.153975+00:00",
    updated_at: "2025-11-25T21:55:19.153975+00:00",
    profiles: {
      fname: "Cynthia",
      lname: "Adaji",
      avatar_url: "dace4d2e-d909-4f9e-aed0-2ec185eed08e/1763748126497.png",
    },
    likes: [],
    shares: [],
    comments: [
      {
        id: "f18cdd68-caa2-42c5-b6b2-dc364c1ee3ef",
        files: [],
        guest: "GuestJack",
        likes: [],
        author: null,
        comment: "REST APIs are easier to understand with this guide.",
        post_id: "d807e672-2f5f-4a1f-9b7f-e44703ec5074",
        user_id: null,
        parent_id: null,
        created_at: "2025-11-28T01:33:22.733752+00:00",
        updated_at: "2025-11-28T01:33:22.733752+00:00",
        replies: [],
      },
    ],
  },
  {
    id: "f86264a9-7e12-4096-9b92-8ade1a44c3a6",
    user_id: "dace4d2e-d909-4f9e-aed0-2ec185eed08e",
    title: "React Performance Optimization",
    text: "Exploring memoization, lazy loading, and efficient state updates.",
    files: [
      "https://xlvrushndhimqhihcyqw.supabase.co/storage/v1/object/public/blog/13.jpg",
    ],
    published: true,
    created_at: "2025-11-25T21:55:19.153975+00:00",
    updated_at: "2025-11-25T21:55:19.153975+00:00",
    profiles: {
      fname: "Cynthia",
      lname: "Adaji",
      avatar_url: "dace4d2e-d909-4f9e-aed0-2ec185eed08e/1763748126497.png",
    },
    likes: [],
    shares: [],
    comments: [
      {
        id: "8f9fc0cd-a97b-407d-91c5-a0cb343ec5ef",
        files: [
          "https://xlvrushndhimqhihcyqw.supabase.co/storage/v1/object/public/blog/public/comments/productivity.png",
        ],
        guest: null,
        likes: [],
        author: {
          fname: "Cynthia",
          lname: "Adaji",
          avatar_url: "dace4d2e-d909-4f9e-aed0-2ec185eed08e/1763748126497.png",
        },
        comment: "These productivity hacks are game-changers!",
        post_id: "f86264a9-7e12-4096-9b92-8ade1a44c3a6",
        user_id: "dace4d2e-d909-4f9e-aed0-2ec185eed08e",
        parent_id: null,
        created_at: "2025-11-28T01:33:22.733752+00:00",
        updated_at: "2025-11-28T01:33:22.733752+00:00",
        replies: [],
      },
    ],
  },
  {
    id: "19a51567-e5bb-4d66-bdd0-4d4c7858ace8",
    user_id: "dace4d2e-d909-4f9e-aed0-2ec185eed08e",
    title: "How to Stay Motivated as a Developer",
    text: "Churn kills startups quietly. Many teams obsess over acquisition and only later realize that retention is the real lever for sustainable growth. In our first year, we identified three practical interventions that materially reduced churn: better onboarding sequences, clearer success milestones, and early intervention playbooks for at-risk accounts.\\n\\nOnboarding matters more than elegant design. We replaced a feature walkthrough with an outcomes-driven checklist that users could complete in under 20 minutes. Each checklist completion fed into our success dashboard and triggered targeted in-app tips. Second, we defined measurable success milestones for the product — a simple set of actions that predicted long-term retention. When users failed to hit milestone one within seven days, the system created a task for a customer success check-in.\\n\\nLastly, the intervention playbook standardized outreach for at-risk accounts: a sequence of personalized emails, an offer of a live short session, and guided documentation. By combining these three steps, we saw a reduction in churn of roughly 18% over two quarters. The pragmatic takeaway is to instrument signals early and design low-friction, automated interventions before human touch is necessary.",
    files: [],
    published: false,
    created_at: "2025-11-25T21:55:19.153975+00:00",
    updated_at: "2025-11-25T21:55:19.153975+00:00",
    profiles: {
      fname: "Cynthia",
      lname: "Adaji",
      avatar_url: "dace4d2e-d909-4f9e-aed0-2ec185eed08e/1763748126497.png",
    },
    likes: [],
    shares: [],
    comments: [
      {
        id: "2c0ed590-6657-42b1-8bb8-3f59056cdf40",
        files: [
          "https://xlvrushndhimqhihcyqw.supabase.co/storage/v1/object/public/blog/public/comments/deploy1.png",
        ],
        guest: null,
        likes: [
          {
            id: "33f0a7df-7972-41d8-ba1c-9cfe79c50bd4",
            guest: null,
            post_id: null,
            user_id: "a011cebe-1b5e-4972-bd00-fcfb188725a3",
            comment_id: "2c0ed590-6657-42b1-8bb8-3f59056cdf40",
            created_at: "2025-11-30T11:49:01.930087+00:00",
            like_actor: "a011cebe-1b5e-4972-bd00-fcfb188725a3",
            updated_at: "2025-11-30T11:49:01.930087+00:00",
          },
        ],
        author: {
          fname: "Edna",
          lname: "Adaji",
          avatar_url: "ca6611b0-0980-4e83-bfda-14257540a9fe/1763748126497.png",
        },
        comment: "CI/CD pipelines are a lifesaver!",
        post_id: "19a51567-e5bb-4d66-bdd0-4d4c7858ace8",
        user_id: "ca6611b0-0980-4e83-bfda-14257540a9fe",
        parent_id: null,
        created_at: "2025-11-28T01:33:22.733752+00:00",
        updated_at: "2025-11-28T01:33:22.733752+00:00",
        replies: [
          {
            id: "2d61c385-e201-438a-b0bd-b5779a8c1af3",
            files: [],
            guest: "GuestFrank",
            likes: [],
            author: null,
            comment: "Totally agree!",
            post_id: "19a51567-e5bb-4d66-bdd0-4d4c7858ace8",
            user_id: null,
            parent_id: "2c0ed590-6657-42b1-8bb8-3f59056cdf40",
            created_at: "2025-11-28T01:33:22.733752+00:00",
            updated_at: "2025-11-28T01:33:22.733752+00:00",
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: "62de0186-a9c9-40d7-8b90-b011229b554b",
    user_id: "ca6611b0-0980-4e83-bfda-14257540a9fe",
    title: "Tips for Becoming a Better Developer",
    text: "Hiring a first product manager is a pivotal decision. Too junior and they will struggle with prioritization; too senior and they may expect headcount and processes you don't have. We solved this by writing a role-first brief that emphasized outcomes over activities: deliver a product roadmap that leads to X% activation increase, reduce onboarding time by Y, and own feature prioritization in collaboration with engineering and sales.\\n\\nInterviews focused on past examples of trade-offs and prioritization rather than hypothetical frameworks. We asked candidates to walk through specific decisions they had made, the data used, stakeholders involved, and the measured outcome. This approach revealed practical experience over theoretical knowledge.\\n\\nOnce hired, the PM had a 90-day plan jointly signed by the CEO outlining success metrics and stakeholder commitments. The clarity of expectations and early wins helped the hire integrate quickly and deliver measurable impact.",
    files: [],
    published: true,
    created_at: "2025-11-25T21:55:19.153975+00:00",
    updated_at: "2025-11-25T21:55:19.153975+00:00",
    profiles: {
      fname: "Edna",
      lname: "Adaji",
      avatar_url: "ca6611b0-0980-4e83-bfda-14257540a9fe/1763748126497.png",
    },
    likes: [],
    shares: [],
    comments: [
      {
        id: "af85878c-deb5-44ba-b08c-a54f2f641129",
        files: [
          "https://xlvrushndhimqhihcyqw.supabase.co/storage/v1/object/public/blog/public/comments/ui1.png",
        ],
        guest: null,
        likes: [],
        author: {
          fname: "Edna",
          lname: "Adaji",
          avatar_url: "ca6611b0-0980-4e83-bfda-14257540a9fe/1763748126497.png",
        },
        comment: "UI/UX design tips are great!",
        post_id: "62de0186-a9c9-40d7-8b90-b011229b554b",
        user_id: "ca6611b0-0980-4e83-bfda-14257540a9fe",
        parent_id: null,
        created_at: "2025-11-28T01:33:22.733752+00:00",
        updated_at: "2025-11-28T01:33:22.733752+00:00",
        replies: [
          {
            id: "2749b9ce-e408-4b49-86ae-108d66c8cc24",
            files: [],
            guest: "GuestHannah",
            likes: [],
            author: null,
            comment: "I love these principles.",
            post_id: "62de0186-a9c9-40d7-8b90-b011229b554b",
            user_id: null,
            parent_id: "af85878c-deb5-44ba-b08c-a54f2f641129",
            created_at: "2025-11-28T01:33:22.733752+00:00",
            updated_at: "2025-11-28T01:33:22.733752+00:00",
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: "7df4a06f-2b86-41af-b402-0fe61b802f66",
    user_id: "ca6611b0-0980-4e83-bfda-14257540a9fe",
    title: "Optimizing Database Queries",
    text: "Paid acquisition can drive growth quickly but it is rarely sustainable at early stages. We experimented with three non-paid channels that proved durable: strategic partnerships, content with SEO compounding, and product-led growth hooks.\\n\\nPartnerships required a service mindset — we identified companies whose customers needed our product and created co-marketing plays that delivered value to both sides. SEO content initially required an investment but compounded over time, delivering a steady stream of qualified leads. The product-led hooks focused on creating immediate value within the product and subtle viral mechanics encouraging sharing.\\n\\nA disciplined measurement stack allowed us to shift resources toward channels with positive unit economics. The goal is not to avoid paid channels, but to treat them as amplifiers of proven organic signals. When organic channels work, paid can be deployed to scale them efficiently.",
    files: [],
    published: true,
    created_at: "2025-11-25T21:55:19.153975+00:00",
    updated_at: "2025-11-25T21:55:19.153975+00:00",
    profiles: {
      fname: "Edna",
      lname: "Adaji",
      avatar_url: "ca6611b0-0980-4e83-bfda-14257540a9fe/1763748126497.png",
    },
    likes: [],
    shares: [],
    comments: [
      {
        id: "c42b9a18-2246-4767-8d1d-2e783633c42b",
        files: [],
        guest: null,
        likes: [],
        author: {
          fname: "Cynthia",
          lname: "Adaji",
          avatar_url: "dace4d2e-d909-4f9e-aed0-2ec185eed08e/1763748126497.png",
        },
        comment: "Motivation is hard, these tips help!",
        post_id: "7df4a06f-2b86-41af-b402-0fe61b802f66",
        user_id: "dace4d2e-d909-4f9e-aed0-2ec185eed08e",
        parent_id: null,
        created_at: "2025-11-28T01:33:22.733752+00:00",
        updated_at: "2025-11-28T01:33:22.733752+00:00",
        replies: [],
      },
    ],
  },
  {
    id: "3bf892ee-d157-4e7c-92c9-ad97de9d47d7",
    user_id: "ca6611b0-0980-4e83-bfda-14257540a9fe",
    title: "Building a Modern Web App",
    text: "Scale exposes the cracks in process and values. We grew from 3 to 18 people in under a year and learned quickly that hiring without operational guardrails leads to drift. Operational discipline doesn't mean bureaucracy — it means defined decision rights, onboarding checklists, and a cadence of communication that preserves culture.\\n\\nWe adopted three practices: weekly leadership syncs with a clear agenda, written decision logs for non-trivial calls, and a 'buddy' onboarding system for new hires that pairs culture exposure with practical training. These changes cut onboarding time by nearly half and reduced errors created by inconsistent handoffs.\\n\\nGuardrails also include how you hire. We tightened job briefs to reflect outcomes and introduced structured interviews focused on past behavior rather than hypothetical answers. Structure provided predictability and helped us scale while keeping core values visible across teams.",
    files: [
      "https://xlvrushndhimqhihcyqw.supabase.co/storage/v1/object/public/blog/7.jpg",
      "https://xlvrushndhimqhihcyqw.supabase.co/storage/v1/object/public/blog/8.jpg",
    ],
    published: true,
    created_at: "2025-11-25T21:55:19.153975+00:00",
    updated_at: "2025-11-25T21:55:19.153975+00:00",
    profiles: {
      fname: "Edna",
      lname: "Adaji",
      avatar_url: "ca6611b0-0980-4e83-bfda-14257540a9fe/1763748126497.png",
    },
    likes: [],
    shares: [],
    comments: [
      {
        id: "6bda7582-07ad-4430-9ff9-3923545008be",
        files: [],
        guest: "GuestGrace",
        likes: [],
        author: null,
        comment: "Optimizing queries saves so much time!",
        post_id: "3bf892ee-d157-4e7c-92c9-ad97de9d47d7",
        user_id: null,
        parent_id: null,
        created_at: "2025-11-28T01:33:22.733752+00:00",
        updated_at: "2025-11-28T01:33:22.733752+00:00",
        replies: [
          {
            id: "948c193b-cc4f-47d4-b4e8-5ac14161bbd0",
            files: [],
            guest: null,
            likes: [],
            author: {
              fname: "Edna",
              lname: "Adaji",
              avatar_url:
                "ca6611b0-0980-4e83-bfda-14257540a9fe/1763748126497.png",
            },
            comment: "Exactly, indexes are key.",
            post_id: "3bf892ee-d157-4e7c-92c9-ad97de9d47d7",
            user_id: "ca6611b0-0980-4e83-bfda-14257540a9fe",
            parent_id: "6bda7582-07ad-4430-9ff9-3923545008be",
            created_at: "2025-11-28T01:33:22.733752+00:00",
            updated_at: "2025-11-28T01:33:22.733752+00:00",
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: "474ac6aa-a094-4885-980d-66237c6ecd4d",
    user_id: "dace4d2e-d909-4f9e-aed0-2ec185eed08e",
    title: "Design Systems Explained",
    text: "Everyone talks about product-market fit, but few teams are disciplined about how they do discovery. We replaced ad-hoc customer calls with a repeatable discovery framework: hypothesis, interview guide, test, and measure. Every interview had three consistent sections — problem validation, solution reservation, and purchase intent — which made insights comparable across prospects.\\n\\nWe tracked signals that correlated with subsequent purchase behavior and discovered surprising patterns: certain job titles had four times higher willingness to pay and specific phrasing in pain statements predicted urgency. Those signals helped us re-prioritize roadmap items and tailor messaging to the highest-converting segments.\\n\\nDiscovery is not a one-off; it is an operational rhythm. By institutionalizing it, we turned qualitative interviews into quantifiable signals that informed product decisions and improved acquisition efficiency.",
    files: [
      "https://xlvrushndhimqhihcyqw.supabase.co/storage/v1/object/public/blog/9.jpg",
    ],
    published: true,
    created_at: "2025-11-25T21:55:19.153975+00:00",
    updated_at: "2025-11-25T21:55:19.153975+00:00",
    profiles: {
      fname: "Cynthia",
      lname: "Adaji",
      avatar_url: "dace4d2e-d909-4f9e-aed0-2ec185eed08e/1763748126497.png",
    },
    likes: [],
    shares: [],
    comments: [
      {
        id: "1e63679e-31ca-488a-8ca4-ab0d29cb6542",
        files: [],
        guest: null,
        likes: [],
        author: {
          fname: "Cynthia",
          lname: "Adaji",
          avatar_url: "dace4d2e-d909-4f9e-aed0-2ec185eed08e/1763748126497.png",
        },
        comment: "Nice JS tricks, I learned something new.",
        post_id: "474ac6aa-a094-4885-980d-66237c6ecd4d",
        user_id: "dace4d2e-d909-4f9e-aed0-2ec185eed08e",
        parent_id: null,
        created_at: "2025-11-28T01:33:22.733752+00:00",
        updated_at: "2025-11-28T01:33:22.733752+00:00",
        replies: [],
      },
    ],
  },
  {
    id: "05324d11-02a3-4a38-bf53-f4f6e0108431",
    user_id: "dace4d2e-d909-4f9e-aed0-2ec185eed08e",
    title: "Productivity Hacks for Tech Teams",
    text: "When we launched our first product, I told myself we would not hire salespeople until we had a repeatable funnel. We were two founders, a small marketing budget, and a mountain of cold outreach to do. The first six months were brutal — meetings that led nowhere, demo fatigue, and a constant scramble to justify our runway decisions. But instead of treating sales as a black box, we treated it like a product to be iterated.\\n\\nFirst, we mapped the full buyer journey end to end: discovery channels, lead qualification criteria, onboarding success triggers, and churn signals. We instrumented every point with lightweight analytics and started running weekly experiments. The key insight was that a small set of content assets (one deep-case study, a 12-minute product walkthrough, and a template we gave away) generated nearly 60% of our qualified leads when amplified with targeted ads and warm email sequences.\\n\\nNext, qualification rules moved out of subjective judgment and into explicit criteria. If a prospect hit two or more product-fit signals and had a clear timeframe, they moved to the demo queue. Otherwise they entered a nurture flow. That simple change reduced our demo time by 40% and eliminated half the “talkative but unready” prospects. Finally, we standardized the demo experience into a 20-minute playbook focused on outcomes, not features.\\n\\nThe result: by month nine, our conversion from demo to paid had improved enough that hiring a single SDR made sense. But crucially, the SDR relied on the repeatable funnel we had built — playbooks, qualification flags, and content-driven outreach. If you’re a founder trying to delay headcount, treat sales like a product: instrument, iterate, and automate the parts that don’t require nuanced human judgement.",
    files: [
      "https://xlvrushndhimqhihcyqw.supabase.co/storage/v1/object/public/blog/1.jpg",
      "https://xlvrushndhimqhihcyqw.supabase.co/storage/v1/object/public/blog/2.jpg",
    ],
    published: true,
    created_at: "2025-11-25T21:55:19.153975+00:00",
    updated_at: "2025-11-25T21:55:19.153975+00:00",
    profiles: {
      fname: "Cynthia",
      lname: "Adaji",
      avatar_url: "dace4d2e-d909-4f9e-aed0-2ec185eed08e/1763748126497.png",
    },
    likes: [],
    shares: [],
    comments: [
      {
        id: "67aded16-df22-4db8-859e-d38f066ff702",
        files: [],
        guest: null,
        likes: [],
        author: {
          fname: "Edna",
          lname: "Adaji",
          avatar_url: "ca6611b0-0980-4e83-bfda-14257540a9fe/1763748126497.png",
        },
        comment: "Great post! Learned a lot.",
        post_id: "05324d11-02a3-4a38-bf53-f4f6e0108431",
        user_id: "ca6611b0-0980-4e83-bfda-14257540a9fe",
        parent_id: null,
        created_at: "2025-11-28T01:33:22.733752+00:00",
        updated_at: "2025-11-28T01:33:22.733752+00:00",
        replies: [],
      },
      {
        id: "c4f64073-d68a-4e7b-8a1e-03c1c405cb93",
        files: [
          "https://xlvrushndhimqhihcyqw.supabase.co/storage/v1/object/public/blog/public/comments/file1.png",
        ],
        guest: "GuestAlice",
        likes: [],
        author: null,
        comment: "Thanks for sharing!",
        post_id: "05324d11-02a3-4a38-bf53-f4f6e0108431",
        user_id: null,
        parent_id: null,
        created_at: "2025-11-28T01:33:22.733752+00:00",
        updated_at: "2025-11-28T01:33:22.733752+00:00",
        replies: [
          {
            id: "c5f65ad1-dc92-44aa-8052-6d5633975e07",
            files: [],
            guest: "GuestBob",
            likes: [],
            author: null,
            comment: "I agree with you!",
            post_id: "05324d11-02a3-4a38-bf53-f4f6e0108431",
            user_id: null,
            parent_id: "c4f64073-d68a-4e7b-8a1e-03c1c405cb93",
            created_at: "2025-11-28T01:33:22.733752+00:00",
            updated_at: "2025-11-28T01:33:22.733752+00:00",
            replies: [],
          },
        ],
      },
      {
        id: "96b00a00-77f1-4f8d-bfab-f53584f72185",
        files: [],
        guest: null,
        likes: [],
        author: {
          fname: "Cynthia",
          lname: "Adaji",
          avatar_url: "dace4d2e-d909-4f9e-aed0-2ec185eed08e/1763748126497.png",
        },
        comment: "Excited to try these tips!",
        post_id: "05324d11-02a3-4a38-bf53-f4f6e0108431",
        user_id: "dace4d2e-d909-4f9e-aed0-2ec185eed08e",
        parent_id: null,
        created_at: "2025-11-28T01:33:22.733752+00:00",
        updated_at: "2025-11-28T01:33:22.733752+00:00",
        replies: [
          {
            id: "112d1f9e-032b-4ec3-9f1c-8c95a1da9fca",
            files: [],
            guest: null,
            likes: [],
            author: {
              fname: "Edna",
              lname: "Adaji",
              avatar_url:
                "ca6611b0-0980-4e83-bfda-14257540a9fe/1763748126497.png",
            },
            comment: "Let me know how it goes!",
            post_id: "05324d11-02a3-4a38-bf53-f4f6e0108431",
            user_id: "ca6611b0-0980-4e83-bfda-14257540a9fe",
            parent_id: "96b00a00-77f1-4f8d-bfab-f53584f72185",
            created_at: "2025-11-28T01:33:22.733752+00:00",
            updated_at: "2025-11-28T01:33:22.733752+00:00",
            replies: [],
          },
        ],
      },
    ],
  },
];
