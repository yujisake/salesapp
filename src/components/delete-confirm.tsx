"use client";

interface Props {
  companyName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirm({
  companyName,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-gray-900">案件を削除</h3>
        <p className="mt-2 text-sm text-gray-600">
          <span className="font-medium">{companyName}</span>
          の案件を削除してもよろしいですか？
        </p>
        <p className="mt-1 text-xs text-gray-400">この操作は取り消せません。</p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700"
          >
            削除する
          </button>
        </div>
      </div>
    </div>
  );
}
